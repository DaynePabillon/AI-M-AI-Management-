/* global gapi */
// gapi is loaded from the script tag in index.html

const SCOPES = 'https://www.googleapis.com/auth/drive.file';

class GoogleDriveService {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: SCOPES,
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Create project folder
  async createProjectFolder(projectName) {
    await this.init();

    const fileMetadata = {
      name: projectName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const response = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, webViewLink',
    });

    return response.result;
  }

  // Upload file to project folder
  async uploadFile(file, folderId) {
    await this.init();

    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ Authorization: 'Bearer ' + gapi.auth.getToken().access_token }),
      body: formData,
    });

    return response.json();
  }

  // List files in folder
  async listFilesInFolder(folderId) {
    await this.init();

    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink)',
      orderBy: 'modifiedTime desc',
    });

    return response.result.files;
  }

  // Share folder with team members
  async shareFolderWithTeam(folderId, emails) {
    await this.init();

    const permissions = emails.map(email => ({
      type: 'user',
      role: 'writer',
      emailAddress: email,
    }));

    const results = [];
    for (const permission of permissions) {
      const response = await gapi.client.drive.permissions.create({
        fileId: folderId,
        resource: permission,
        sendNotificationEmail: true,
      });
      results.push(response.result);
    }

    return results;
  }
}

const googleDriveService = new GoogleDriveService();
export default googleDriveService;
