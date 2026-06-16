import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project } from '../data/projects';
import type { TechItem } from '../data/techStack';
import type { Experience } from '../data/experience';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export interface ResumeData {
  projects: Project[];
  techStack: TechItem[];
  experience: Experience[];
}

export class ResumeService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF('p', 'pt', 'letter');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 40;
    this.currentY = this.margin;
  }

  private addLine(y: number, color: [number, number, number] = [211, 211, 211]) {
    this.doc.setDrawColor(...color);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, y, this.pageWidth - this.margin, y);
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private async loadImageAsBase64(imagePath: string): Promise<string | null> {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load image:', error);
      return null;
    }
  }

  private addHeader(photoBase64: string | null): void {
    // Calculate dimensions for photo to match LaTeX template
    const photoWidth = 75; // 2.7cm ≈ 75pt
    const photoHeight = 90; // 3.2cm ≈ 90pt

    // Store initial Y position
    const startY = this.currentY;

    // Add photo on the right side, properly aligned
    if (photoBase64) {
      const photoX = this.pageWidth - this.margin - photoWidth;
      const photoY = startY;
      
      try {
        this.doc.addImage(photoBase64, 'PNG', photoX, photoY, photoWidth, photoHeight);
      } catch (error) {
        console.error('Failed to add photo:', error);
      }
    }

    // Left side: Name (matching LaTeX style - larger, more prominent)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(28);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Rhenel Jhon R. Sajol', this.margin, this.currentY + 15);
    
    this.currentY += 40;

    // Contact details - matching LaTeX layout with icons represented as symbols
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    
    // First line: Phone | Email | Location (with some spacing)
    let xPos = this.margin;
    
    // Phone
    this.doc.text('09536145105', xPos, this.currentY);
    xPos += this.doc.getTextWidth('09536145105') + 15;
    
    this.doc.text('|', xPos, this.currentY);
    xPos += 10;
    
    // Email
    this.doc.text('sajol.rhenel123@gmail.com', xPos, this.currentY);
    xPos += this.doc.getTextWidth('sajol.rhenel123@gmail.com') + 15;
    
    this.doc.text('|', xPos, this.currentY);
    xPos += 10;
    
    // Location
    this.doc.text('Cagayan de Oro City, Philippines', xPos, this.currentY);
    
    this.currentY += 14;

    // Second line: GitHub | Portfolio
    xPos = this.margin;
    
    // GitHub
    this.doc.text('github.com/Tetsuuya', xPos, this.currentY);
    xPos += this.doc.getTextWidth('github.com/Tetsuuya') + 15;
    
    this.doc.text('|', xPos, this.currentY);
    xPos += 10;
    
    // Portfolio
    this.doc.text('rhnl-jhon-sajol.vercel.app', xPos, this.currentY);
    
    this.currentY += 20;

    // Ensure we're below the photo before continuing
    const photoBottom = startY + photoHeight + 5;
    if (this.currentY < photoBottom) {
      this.currentY = photoBottom;
    }
  }

  private addSection(title: string): void {
    this.checkPageBreak(40);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title.toUpperCase(), this.margin, this.currentY);
    
    this.currentY += 3;
    this.addLine(this.currentY);
    this.currentY += 12;
  }

  private addEducation(): void {
    this.addSection('Education');

    const educationItems = [
      {
        institution: 'University of Science and Technology of Southern Philippines',
        period: '2023 - Present',
        degree: 'Bachelor of Science in Computer Science',
        location: 'Cagayan de Oro City',
        details: [
          "Dean's Lister: 2nd Honor (1st Sem 2023-24), 3rd Honor (2nd Sem 2023-24), 2nd Honor (1st Sem 2024-25)",
          'Certification: Level 1 - Test of Practical Competency in IT (2024)'
        ]
      },
      {
        institution: 'Liceo de Cagayan University',
        period: '2021 - 2023',
        degree: 'Senior High School - STEM Strand',
        location: 'Cagayan de Oro City',
        details: []
      },
      {
        institution: 'Misamis Oriental General Comprehensive High School',
        period: '2017 - 2021',
        degree: 'Junior High School - With Honors',
        location: 'Cagayan de Oro City',
        details: []
      }
    ];

    educationItems.forEach((item, index) => {
      this.checkPageBreak(70);
      
      // Institution (bold) and period (gray, right-aligned)
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(item.institution, this.margin, this.currentY);
      
      this.doc.setTextColor(80, 80, 80);
      this.doc.setFont('helvetica', 'normal');
      const periodWidth = this.doc.getTextWidth(item.period);
      this.doc.text(item.period, this.pageWidth - this.margin - periodWidth, this.currentY);
      
      this.currentY += 13;

      // Degree (italic) and location (gray, italic, right-aligned)
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(9);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(item.degree, this.margin, this.currentY);
      
      this.doc.setTextColor(80, 80, 80);
      const locationWidth = this.doc.getTextWidth(item.location);
      this.doc.text(item.location, this.pageWidth - this.margin - locationWidth, this.currentY);
      
      this.currentY += 12;

      // Details (bulleted list)
      if (item.details.length > 0) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        this.doc.setTextColor(0, 0, 0);
        
        item.details.forEach((detail) => {
          const maxWidth = this.pageWidth - 2 * this.margin - 15;
          const lines = this.doc.splitTextToSize(detail, maxWidth);
          
          lines.forEach((line: string, lineIndex: number) => {
            this.checkPageBreak(12);
            if (lineIndex === 0) {
              // First line with bullet
              this.doc.text('•', this.margin + 5, this.currentY);
              this.doc.text(line, this.margin + 15, this.currentY);
            } else {
              // Continuation lines
              this.doc.text(line, this.margin + 15, this.currentY);
            }
            this.currentY += 11;
          });
        });
      }

      // Space between items
      if (index < educationItems.length - 1) {
        this.currentY += 6;
      }
    });

    this.currentY += 8;
  }

  private addProjects(projects: Project[]): void {
    this.addSection('Projects');

    // Sort projects: featured first, then by updated_at
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    sortedProjects.forEach((project, index) => {
      this.checkPageBreak(80);

      // Project name | tech stack | type
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      
      const techStackStr = project.techStack?.join(', ') || '';
      const projectType = project.featured ? 'Academic' : 'Personal';
      const maxTitleWidth = this.pageWidth - 2 * this.margin - 50; // Reserve space for year
      
      const projectTitle = `${project.name} | ${techStackStr} | ${projectType}`;
      const titleLines = this.doc.splitTextToSize(projectTitle, maxTitleWidth);
      
      // Year on the right
      const year = new Date(project.updated_at).getFullYear().toString();
      this.doc.setTextColor(80, 80, 80);
      this.doc.setFont('helvetica', 'normal');
      const yearWidth = this.doc.getTextWidth(year);
      this.doc.text(year, this.pageWidth - this.margin - yearWidth, this.currentY);
      
      // Title on the left
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      titleLines.forEach((line: string, lineIdx: number) => {
        if (lineIdx > 0) this.currentY += 11;
        this.doc.text(line, this.margin, this.currentY);
      });
      
      this.currentY += 13;

      // Description
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(0, 0, 0);
      
      const maxDescWidth = this.pageWidth - 2 * this.margin - 15;
      const descLines = this.doc.splitTextToSize(project.description, maxDescWidth);
      
      descLines.forEach((line: string, lineIndex: number) => {
        this.checkPageBreak(12);
        if (lineIndex === 0) {
          this.doc.text('•', this.margin + 5, this.currentY);
          this.doc.text(line, this.margin + 15, this.currentY);
        } else {
          this.doc.text(line, this.margin + 15, this.currentY);
        }
        this.currentY += 11;
      });

      // Links
      if (project.html_url || project.repo_url) {
        this.checkPageBreak(12);
        const linkUrl = project.repo_url || project.html_url;
        this.doc.setTextColor(0, 0, 255);
        this.doc.text('•', this.margin + 5, this.currentY);
        
        // Split long URLs
        const maxLinkWidth = this.pageWidth - 2 * this.margin - 15;
        const linkLines = this.doc.splitTextToSize(linkUrl, maxLinkWidth);
        
        linkLines.forEach((linkLine: string, linkIdx: number) => {
          if (linkIdx > 0) {
            this.checkPageBreak(11);
            this.currentY += 11;
          }
          this.doc.text(linkLine, this.margin + 15, this.currentY);
        });
        
        this.currentY += 11;
      }

      // Space between projects
      if (index < sortedProjects.length - 1) {
        this.currentY += 6;
      }
    });

    this.currentY += 8;
  }

  private addSkills(techStack: TechItem[]): void {
    this.addSection('Skills');

    // Group tech items by category
    const categories: { [key: string]: string[] } = {
      'Languages': [],
      'Frameworks': [],
      'Databases': [],
      'Tools': [],
      'Concepts': []
    };

    techStack.forEach((item) => {
      const categoryKey = item.category === 'Language' ? 'Languages' :
                         item.category === 'Framework' ? 'Frameworks' :
                         item.category === 'Database' ? 'Databases' :
                         item.category === 'Tool' ? 'Tools' :
                         item.category === 'Design' ? 'Tools' : 'Concepts';
      
      if (categories[categoryKey]) {
        categories[categoryKey].push(item.name);
      }
    });

    // Add additional concepts not in tech stack
    categories['Concepts'] = [
      'REST APIs',
      'WebRTC',
      'WebSocket',
      'UI/UX',
      'Data Analysis',
      'Linear Regression'
    ];

    // Render each category
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);

    Object.entries(categories).forEach(([category, items]) => {
      if (items.length === 0) return;
      
      this.checkPageBreak(20);
      
      const categoryLabel = `${category}: `;
      const itemsText = items.join(', ');
      
      // Bold category label
      this.doc.setFont('helvetica', 'bold');
      const labelWidth = this.doc.getTextWidth(categoryLabel);
      this.doc.text(categoryLabel, this.margin, this.currentY);
      
      // Normal items text
      this.doc.setFont('helvetica', 'normal');
      const maxWidth = this.pageWidth - 2 * this.margin - labelWidth;
      const lines = this.doc.splitTextToSize(itemsText, maxWidth);
      
      lines.forEach((line: string, index: number) => {
        if (index === 0) {
          this.doc.text(line, this.margin + labelWidth, this.currentY);
        } else {
          this.checkPageBreak(12);
          this.currentY += 12;
          this.doc.text(line, this.margin + labelWidth, this.currentY);
        }
      });
      
      this.currentY += 14;
    });

    this.currentY += 4;
  }

  private addExperience(experiences: Experience[]): void {
    // Only add section if there are experiences
    if (experiences.length === 0) return;

    this.addSection('Experience');

    experiences.forEach((exp, index) => {
      this.checkPageBreak(80);

      // Company (bold) and duration (gray, right-aligned)
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(exp.company, this.margin, this.currentY);
      
      this.doc.setTextColor(80, 80, 80);
      this.doc.setFont('helvetica', 'normal');
      const durationWidth = this.doc.getTextWidth(exp.duration);
      this.doc.text(exp.duration, this.pageWidth - this.margin - durationWidth, this.currentY);
      
      this.currentY += 13;

      // Role (italic)
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(9);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(exp.role, this.margin, this.currentY);
      
      this.currentY += 12;

      // Description (bulleted)
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(0, 0, 0);
      
      const maxWidth = this.pageWidth - 2 * this.margin - 15;
      const descLines = this.doc.splitTextToSize(exp.description, maxWidth);
      
      descLines.forEach((line: string, lineIndex: number) => {
        this.checkPageBreak(12);
        if (lineIndex === 0) {
          this.doc.text('•', this.margin + 5, this.currentY);
          this.doc.text(line, this.margin + 15, this.currentY);
        } else {
          this.doc.text(line, this.margin + 15, this.currentY);
        }
        this.currentY += 11;
      });

      // Space between items
      if (index < experiences.length - 1) {
        this.currentY += 6;
      }
    });
  }

  async generateResume(data: ResumeData): Promise<void> {
    try {
      // Load profile photo
      const photoPath = '/src/assets/Reusme_photo.png';
      const photoBase64 = await this.loadImageAsBase64(photoPath);

      // Build resume sections
      this.addHeader(photoBase64);
      this.addEducation();
      this.addProjects(data.projects);
      this.addSkills(data.techStack);
      this.addExperience(data.experience);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Rhenel_Jhon_Sajol_Resume_${timestamp}.pdf`;

      // Save PDF
      this.doc.save(filename);
    } catch (error) {
      console.error('Failed to generate resume:', error);
      throw new Error('Resume generation failed');
    }
  }
}

export const resumeService = new ResumeService();

export const generateResumePDF = async (data: ResumeData): Promise<void> => {
  const service = new ResumeService();
  await service.generateResume(data);
};
