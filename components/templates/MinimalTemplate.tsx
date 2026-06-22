import type { Section, ContactData, SummaryData, ExperienceData, EducationData, SkillsData, ProjectsData, CertificationsData, LanguagesData } from '@/lib/types';

interface Props {
  sections: Section[];
  accentColor: string;
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: 8 }}>
      {title}
    </h2>
  );
}

export default function MinimalTemplate({ sections, accentColor }: Props) {
  const get = <T,>(type: string) => sections.find((s) => s.type === type && s.enabled)?.data as T | undefined;

  const contact = get<ContactData>('contact');
  const summary = get<SummaryData>('summary');
  const experience = get<ExperienceData>('experience');
  const education = get<EducationData>('education');
  const skills = get<SkillsData>('skills');
  const projects = get<ProjectsData>('projects');
  const activities = get<ExperienceData>('activities');
  const certifications = get<CertificationsData>('certifications');
  const languages = get<LanguagesData>('languages');

  const ordered = sections.filter((s) => s.enabled && s.type !== 'contact');

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: '#1a1a1a', lineHeight: 1.5 }}>
      {/* Header */}
      {contact && (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', color: '#111', marginBottom: 6 }}>
            {contact.name || 'Your Name'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', fontSize: 9, color: '#777' }}>
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.website && <span style={{ color: accentColor }}>{contact.website}</span>}
            {contact.linkedin && <span style={{ color: accentColor }}>{contact.linkedin}</span>}
            {contact.github && <span style={{ color: accentColor }}>{contact.github}</span>}
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e7eb', marginTop: 14 }} />
        </div>
      )}

      {/* Sections */}
      {ordered.map((section) => (
        <div key={section.id} style={{ marginBottom: 18 }}>
          {section.type === 'summary' && summary && (
            <>
              <SectionTitle title="Summary" color={accentColor} />
              <p style={{ fontSize: 9.5, color: '#555', lineHeight: 1.6, maxWidth: '90%' }}>{summary.text}</p>
            </>
          )}

          {section.type === 'experience' && experience && (
            <>
              <SectionTitle title="Experience" color={accentColor} />
              {experience.items.map((item, idx) => (
                <div key={item.id} style={{ marginBottom: idx < experience.items.length - 1 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 10.5 }}>{item.title || 'Job Title'}</span>
                      {item.company && <span style={{ color: '#555', fontSize: 10 }}>, {item.company}</span>}
                    </div>
                    <span style={{ fontSize: 8.5, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 10, textAlign: 'right' }}>
                      {item.startDate}{(item.startDate && (item.current || item.endDate)) ? ' – ' : ''}{item.current ? 'Present' : item.endDate}
                      {item.location ? ` · ${item.location}` : ''}
                    </span>
                  </div>
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '5px 0 0 0', padding: '0 0 0 14px' }}>
                      {item.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, color: '#444', marginBottom: 3, lineHeight: 1.5 }}>{b}</li>
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
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 10.5 }}>{item.school || 'School'}</span>
                      {(item.degree || item.field) && (
                        <span style={{ color: '#555', fontSize: 9.5 }}> · {[item.degree, item.field].filter(Boolean).join(' in ')}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 8.5, color: '#aaa' }}>
                      {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  {item.gpa && <p style={{ fontSize: 8.5, color: '#888', marginTop: 1 }}>GPA: {item.gpa}</p>}
                </div>
              ))}
            </>
          )}

          {section.type === 'skills' && skills && (
            <>
              <SectionTitle title="Skills" color={accentColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {skills.categories.map((cat) => (
                  <div key={cat.id} style={{ display: 'flex', gap: 8 }}>
                    {cat.name && (
                      <span style={{ fontWeight: 600, fontSize: 9.5, minWidth: 80, color: '#555' }}>{cat.name}</span>
                    )}
                    <span style={{ fontSize: 9.5, color: '#444' }}>{cat.skills}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {section.type === 'projects' && projects && (
            <>
              <SectionTitle title="Projects" color={accentColor} />
              {projects.items.map((item, idx) => (
                <div key={item.id} style={{ marginBottom: idx < projects.items.length - 1 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: 10.5 }}>{item.name || 'Project'}</span>
                    {item.link && <span style={{ fontSize: 8.5, color: accentColor }}>{item.link}</span>}
                  </div>
                  {item.technologies && <p style={{ fontSize: 8.5, color: '#888', marginTop: 1 }}>{item.technologies}</p>}
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                      {item.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, color: '#444', marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {section.type === 'activities' && activities && (
            <>
              <SectionTitle title="Activities" color={accentColor} />
              {activities.items.map((item, idx) => (
                <div key={item.id} style={{ marginBottom: idx < activities.items.length - 1 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 10.5 }}>{item.title || 'Role'}</span>
                      {item.company && <span style={{ color: '#555', fontSize: 10 }}>, {item.company}</span>}
                    </div>
                    <span style={{ fontSize: 8.5, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 10, textAlign: 'right' }}>
                      {item.startDate}{(item.startDate && (item.current || item.endDate)) ? ' – ' : ''}{item.current ? 'Present' : item.endDate}
                      {item.location ? ` · ${item.location}` : ''}
                    </span>
                  </div>
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: '5px 0 0 0', padding: '0 0 0 14px' }}>
                      {item.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, color: '#444', marginBottom: 3 }}>{b}</li>
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
                    <span style={{ fontWeight: 600, fontSize: 9.5 }}>{item.name}</span>
                    {item.issuer && <span style={{ fontSize: 9, color: '#888' }}> · {item.issuer}</span>}
                  </div>
                  <span style={{ fontSize: 8.5, color: '#aaa' }}>{item.date}</span>
                </div>
              ))}
            </>
          )}

          {section.type === 'languages' && languages && (
            <>
              <SectionTitle title="Languages" color={accentColor} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                {languages.items.map((item) => (
                  <span key={item.id} style={{ fontSize: 9.5 }}>
                    <span style={{ fontWeight: 600 }}>{item.language}</span>
                    <span style={{ color: '#888' }}> · {item.proficiency}</span>
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
