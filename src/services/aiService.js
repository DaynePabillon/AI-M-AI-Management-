// AI Service - Integrates with OpenAI/Gemini for intelligent features

class AIService {
  constructor() {
    this.provider = process.env.REACT_APP_AI_PROVIDER || 'gemini';
    
    // Get the correct API key based on provider
    if (this.provider === 'gemini') {
      this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    } else {
      this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    }
    
    console.log('AI Service initialized:', {
      provider: this.provider,
      hasApiKey: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'MISSING'
    });
  }

  // Generate project insights
  async generateProjectInsights(project, tasks) {
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const pending = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
    
    const prompt = `Analyze this project briefly:
Project: ${project.name}
Progress: ${project.progress}%
Tasks: ${completed}/${tasks.length} done

Respond ONLY with valid JSON (no markdown, no code blocks) with this exact structure:
{
  "healthScore": <number 1-10>,
  "risks": ["<risk1>", "<risk2>"],
  "recommendations": ["<rec1>", "<rec2>"],
  "predictedCompletion": "<date string>"
}

Be concise.`;

    return this.callAI(prompt, project, tasks);
  }

  // Smart task suggestions
  async suggestTasks(project, existingTasks) {
    const prompt = `
Based on this project, suggest 5 additional tasks that might be needed:

Project: ${project.name}
Description: ${project.description}
Existing Tasks: ${existingTasks.map(t => t.title).join(', ')}

Provide task suggestions with:
- Title
- Description
- Estimated priority (HIGH/MEDIUM/LOW)
- Estimated duration

Format as JSON array.
    `;

    return this.callAI(prompt);
  }

  // Analyze team productivity
  async analyzeTeamProductivity(teamMembers, tasks) {
    const prompt = `
Analyze team productivity:

Team Members: ${teamMembers.length}
Total Tasks: ${tasks.length}
Tasks per member: ${JSON.stringify(
      teamMembers.map(member => ({
        name: member.name,
        tasks: tasks.filter(t => t.assigneeId === member.id).length,
        completed: tasks.filter(t => t.assigneeId === member.id && t.status === 'COMPLETED').length,
      }))
    )}

Provide:
1. Overall team productivity score
2. Individual performance insights
3. Workload balance analysis
4. Recommendations for task redistribution

Format as JSON.
    `;

    return this.callAI(prompt);
  }

  // Generate meeting agenda
  async generateMeetingAgenda(project, tasks, teamMembers) {
    const prompt = `
Generate a project meeting agenda:

Project: ${project.name}
Recent completed tasks: ${tasks.filter(t => t.status === 'COMPLETED').slice(0, 5).map(t => t.title).join(', ')}
Pending critical tasks: ${tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').map(t => t.title).join(', ')}
Team size: ${teamMembers.length}

Create a structured meeting agenda with:
1. Opening (5 min)
2. Progress review (15 min)
3. Blockers discussion (10 min)
4. Next steps (10 min)
5. Q&A (10 min)

Include specific talking points for each section.
    `;

    return this.callAI(prompt);
  }

  // Smart deadline prediction
  async predictDeadline(task, similarTasks) {
    const prompt = `
Predict realistic deadline for this task:

Task: ${task.title}
Description: ${task.description}
Priority: ${task.priority}

Similar completed tasks:
${similarTasks.map(t => `- ${t.title}: took ${t.completionDays} days`).join('\n')}

Provide:
1. Estimated days to complete
2. Confidence level (%)
3. Factors affecting timeline
4. Recommended deadline

Format as JSON.
    `;

    return this.callAI(prompt);
  }

  // Generate project summary for stakeholders
  async generateStakeholderReport(project, tasks, milestones) {
    const prompt = `
Create an executive summary for stakeholders:

Project: ${project.name}
Duration: ${project.startDate} to ${project.endDate}
Progress: ${project.progress}%
Completed milestones: ${milestones.filter(m => m.completed).length}/${milestones.length}
Task completion rate: ${(tasks.filter(t => t.status === 'COMPLETED').length / tasks.length * 100).toFixed(1)}%

Generate a professional summary including:
1. Executive Summary (2-3 sentences)
2. Key Achievements
3. Current Status
4. Upcoming Milestones
5. Risks and Mitigation
6. Next Steps

Format as markdown.
    `;

    return this.callAI(prompt);
  }

  // Call AI API (OpenAI or Gemini)
  async callAI(prompt, project, tasks) {
    if (this.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else if (this.provider === 'gemini') {
      return this.callGemini(prompt, project, tasks);
    }
    throw new Error('Invalid AI provider');
  }

  // OpenAI API call
  async callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert project management AI assistant. Provide concise, actionable insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  // Local AI analysis (fallback when Gemini API is unavailable)
  generateLocalInsights(project, tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate health score
    let healthScore = 7; // Start at 7
    if (completionRate >= 80) healthScore = 9;
    else if (completionRate >= 60) healthScore = 8;
    else if (completionRate < 40) healthScore = 5;
    if (overdueTasks > 3) healthScore -= 2;
    if (overdueTasks > 0) healthScore -= 1;
    healthScore = Math.max(1, Math.min(10, healthScore));
    
    // Generate specific insights based on actual data
    const risks = [];
    const recommendations = [];
    
    if (overdueTasks > 0) {
      risks.push(`⚠️ ${overdueTasks} task${overdueTasks > 1 ? 's are' : ' is'} overdue - immediate attention needed`);
      recommendations.push(`Focus on completing the ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''} first`);
    }
    
    if (highPriorityTasks > 0) {
      recommendations.push(`You have ${highPriorityTasks} high-priority task${highPriorityTasks > 1 ? 's' : ''} - prioritize these`);
    }
    
    if (completionRate < 50) {
      risks.push(`📉 Low completion rate (${completionRate}%) - consider breaking down large tasks`);
      recommendations.push('Break complex tasks into smaller, manageable subtasks');
    } else if (completionRate >= 75) {
      recommendations.push(`🎉 Excellent progress! ${completionRate}% completion rate - keep it up!`);
    }
    
    if (inProgressTasks > 5) {
      risks.push(`🔄 ${inProgressTasks} tasks in progress - may indicate context switching`);
      recommendations.push('Focus on completing current tasks before starting new ones');
    }
    
    if (project.tasksDueSoon > 0) {
      recommendations.push(`📅 ${project.tasksDueSoon} task${project.tasksDueSoon > 1 ? 's' : ''} due in the next 7 days - plan accordingly`);
    }
    
    // Add positive insights
    if (completedTasks > 0) {
      recommendations.push(`✅ ${completedTasks} task${completedTasks > 1 ? 's' : ''} completed - great work!`);
    }
    
    return {
      healthScore,
      risks: risks.length > 0 ? risks : ['No major risks detected'],
      recommendations,
      predictedCompletion: this.calculatePredictedCompletion(tasks, completionRate),
      summary: `Analyzed ${project.totalProjects} project${project.totalProjects !== 1 ? 's' : ''} with ${totalTasks} total tasks. Completion rate: ${completionRate}%.`
    };
  }
  
  calculatePredictedCompletion(tasks, completionRate) {
    const remainingTasks = tasks.filter(t => t.status !== 'DONE' && t.status !== 'COMPLETED').length;
    if (remainingTasks === 0) return 'All tasks completed! 🎉';
    
    // Estimate based on completion rate
    const daysPerTask = completionRate > 0 ? 7 / (completionRate / 10) : 14;
    const estimatedDays = Math.ceil(remainingTasks * daysPerTask);
    const completionDate = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);
    
    return completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Google Gemini API call
  async callGemini(prompt, project, tasks) {
    try {
      console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        console.warn(`Gemini API error: ${response.status} - Using local AI analysis instead`);
        // Use local intelligent analysis as fallback
        return this.generateLocalInsights(project, tasks);
      }

      const data = await response.json();
      
      // Check if response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected Gemini response:', data);
        console.warn('Using local AI analysis instead');
        return this.generateLocalInsights(project, tasks);
      }

      let text = data.candidates[0].content.parts[0].text;
      
      // Strip markdown code blocks if present
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Try to parse as JSON, otherwise return plain text wrapped in object
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('Gemini response is not valid JSON, returning as text');
        return { text }; // return plain text response wrapped in object
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

const aiService = new AIService();
export default aiService;
