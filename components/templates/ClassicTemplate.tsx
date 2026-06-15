import type { Section, ContactData, SummaryData, ExperienceData, EducationData, SkillsData, ProjectsData, CertificationsData, LanguagesData } from '@/lib/types';

interface Props {
  sections: Section[];
  accentColor: string;
}

function Divider({ color }: { color: string }) {
  return <hr style={{ borderColor: color, borderTopWidth: 2, marginTop: 8, marginBottom: 8 }} />;
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color }}>
        {title}
      </h2>
      <div style={{ height: 1, backgroundColor: color, marginTop: 2 }} />
    </div>
  );
}

export default function ClassicTemplate({ sections, accentColor }: Props) {
  const get = <T,>(type: string) => sections.find((s) => s.type === type && s.enabled)?.data as T | undefined;

  const contact = get<ContactData>('contact');
  const summary = get<SummaryData>('summary');
  const experience = get<ExperienceData>('experience');
  const education = get<EducationData>('education');
  const skills = get<SkillsData>('skills');
  const projects = get<ProjectsData>('projects');
  const certifications = get<CertificationsData>('certifications');
  const languages = get<LanguagesData>('languages');

  const ordered = sections.filter((s) => s.enabled && s.type !== 'contact');

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 10, color: '#1a1a1a', lineHeight: 1.4 }}>
      {/* Header */}
      {contact && (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: accentColor, marginBottom: 4, fontFamily: 'Georgia, serif' }}>
            {contact.name || 'Your Name'}
          </h1>
          <div style={{ fontSize: 9, color: '#555', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px' }}>
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.website && <span>{contact.website}</span>}
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.github && <span>{contact.github}</span>}
          </div>
          <div style={{ height: 2, backgroundColor: accentColor, marginTop: 10 }} />
        </div>
      )}

      {/* Ordered sections */}
      {ordered.map((section) => (
        <div key={section.id} style={{ marginBottom: 10 }}>
          {section.type === 'summary' && summary && (
            <>
              <SectionTitle title="Professional Summary" color={accentColor} />
              <p style={{ fontSize: 9.5, color: '#333' }}>{summary.text}</p>
            </>
          )}

          {section.type === 'experience' && experience && (
            <>
              <SectionTitle title="Experience" color={accentColor} />
              {experience.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{item.title || 'Job Title'}</span>
                      {item.company && <span style={{ color: '#555', fontSize: 9.5 }}> — {item.company}</span>}
                    </div>
                    <span style={{ fontSize: 9, color: '#777', whiteSpace: 'nowrap' }}>
                      {item.startDate}{(item.startDate && (item.current || item.endDate)) ? ' – ' : ''}{item.current ? 'Present' : item.endDate}
                      {item.location ? ` · ${item.location}` : ''}
                    </span>
                  </div>
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                      {item.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, color: '#333', marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {section.type === 'education' && education && (
            <>
              <SectionTitle title="Education" color={accentColor} />
              {education.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{item.school || 'School'}</span>
                      {(item.degree || item.field) && (
                        <span style={{ fontSize: 9.5, color: '#555' }}> · {[item.degree, item.field].filter(Boolean).join(' in ')}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 9, color: '#777', whiteSpace: 'nowrap' }}>
                      {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                      {item.location ? ` · ${item.location}` : ''}
                    </span>
                  </div>
                  {item.gpa && <p style={{ fontSize: 9, color: '#555', marginTop: 1 }}>GPA: {item.gpa}</p>}
                </div>
              ))}
            </>
          )}

          {section.type === 'skills' && skills && (
            <>
              <SectionTitle title="Skills" color={accentColor} />
              {skills.categories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 3 }}>
                  {cat.name && <span style={{ fontWeight: 700, fontSize: 9.5 }}>{cat.name}: </span>}
                  <span style={{ fontSize: 9.5, color: '#333' }}>{cat.skills}</span>
                </div>
              ))}
            </>
          )}

          {section.type === 'projects' && projects && (
            <>
              <SectionTitle title="Projects" color={accentColor} />
              {projects.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 10 }}>{item.name || 'Project Name'}</span>
                    {item.link && <span style={{ fontSize: 9, color: accentColor }}>{item.link}</span>}
                  </div>
                  {item.technologies && (
                    <p style={{ fontSize: 9, color: '#777', marginTop: 1 }}>
                      <em>{item.technologies}</em>
                    </p>
                  )}
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                      {item.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, color: '#333', marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {section.type === 'certifications' && certifications && (
            <>
              <SectionTitle title="Certifications" color={accentColor} />
              {certifications.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 9.5 }}>{item.name}</span>
                    {item.issuer && <span style={{ fontSize: 9, color: '#555' }}> · {item.issuer}</span>}
                  </div>
                  <span style={{ fontSize: 9, color: '#777' }}>{item.date}</span>
                </div>
              ))}
            </>
          )}

          {section.type === 'languages' && languages && (
            <>
              <SectionTitle title="Languages" color={accentColor} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                {languages.items.map((item) => (
                  <span key={item.id} style={{ fontSize: 9.5 }}>
                    <strong>{item.language}</strong> ({item.proficiency})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
