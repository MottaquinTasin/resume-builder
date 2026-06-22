import type { Section, ContactData, SummaryData, ExperienceData, EducationData, SkillsData, ProjectsData, CertificationsData, LanguagesData } from '@/lib/types';

interface Props {
  sections: Section[];
  accentColor: string;
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <h2
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color,
        borderBottom: `1px solid ${color}`,
        paddingBottom: 2,
        marginBottom: 6,
      }}
    >
      {title}
    </h2>
  );
}

/** Two-line entry header: org+location, then role+dates (right-aligned). */
function EntryHeader({
  org, location, role, dates,
}: { org: string; location?: string; role?: string; dates?: string }) {
  const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 };
  const left: React.CSSProperties = { minWidth: 0, flex: '1 1 auto' };
  const right: React.CSSProperties = { flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap', fontSize: 9.5 };
  return (
    <>
      <div style={row}>
        <span style={{ ...left, fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{org}</span>
        {location && <span style={{ ...right, fontWeight: 700 }}>{location}</span>}
      </div>
      {(role || dates) && (
        <div style={row}>
          <span style={{ ...left, fontStyle: 'italic', fontSize: 10, color: '#222' }}>{role}</span>
          {dates && <span style={{ ...right, color: '#444' }}>{dates}</span>}
        </div>
      )}
    </>
  );
}

const ul: React.CSSProperties = { margin: '3px 0 0 0', paddingLeft: 16, listStyleType: 'disc' };
const li: React.CSSProperties = { fontSize: 9.5, color: '#222', marginBottom: 2, lineHeight: 1.45 };

function dateRange(start: string, end: string, current?: boolean): string {
  const e = current ? 'Present' : end;
  return [start, e].filter(Boolean).join(' – ');
}

export default function ClassicTemplate({ sections, accentColor }: Props) {
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

  const contactLine = contact
    ? [contact.location, contact.phone, contact.email, contact.website, contact.linkedin, contact.github].filter(Boolean)
    : [];

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 10, color: '#1a1a1a', lineHeight: 1.4 }}>
      {/* Header */}
      {contact && (
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
            {contact.name || 'Your Name'}
          </h1>
          <div style={{ fontSize: 9, color: '#333' }}>{contactLine.join('  |  ')}</div>
        </div>
      )}

      {ordered.map((section) => (
        <div key={section.id} style={{ marginBottom: 11 }}>
          {section.type === 'summary' && summary && summary.text && (
            <>
              <SectionTitle title="Summary" color={accentColor} />
              <p style={{ fontSize: 9.5, color: '#222' }}>{summary.text}</p>
            </>
          )}

          {section.type === 'experience' && experience && (
            <>
              <SectionTitle title="Work Experience" color={accentColor} />
              {experience.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <EntryHeader
                    org={item.company || 'Company'}
                    location={item.location}
                    role={item.title}
                    dates={dateRange(item.startDate, item.endDate, item.current)}
                  />
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={ul}>
                      {item.bullets.filter(Boolean).map((b, i) => <li key={i} style={li}>{b}</li>)}
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
                <div key={item.id} style={{ marginBottom: 7 }}>
                  <EntryHeader
                    org={item.school || 'School'}
                    location={item.location}
                    role={[item.degree, item.field].filter(Boolean).join(', ')}
                    dates={dateRange(item.startDate, item.endDate)}
                  />
                  {item.gpa && <p style={{ fontSize: 9.5, color: '#333', marginTop: 1 }}>GPA: {item.gpa}</p>}
                </div>
              ))}
            </>
          )}

          {section.type === 'projects' && projects && (
            <>
              <SectionTitle title="Projects" color={accentColor} />
              {projects.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <EntryHeader
                    org={item.name || 'Project'}
                    location={item.link || undefined}
                    role={item.technologies}
                  />
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={ul}>
                      {item.bullets.filter(Boolean).map((b, i) => <li key={i} style={li}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {section.type === 'activities' && activities && (
            <>
              <SectionTitle title="Activities" color={accentColor} />
              {activities.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <EntryHeader
                    org={item.company || 'Organization'}
                    location={item.location}
                    role={item.title}
                    dates={dateRange(item.startDate, item.endDate, item.current)}
                  />
                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul style={ul}>
                      {item.bullets.filter(Boolean).map((b, i) => <li key={i} style={li}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {section.type === 'skills' && skills && (
            <>
              <SectionTitle title="Additional" color={accentColor} />
              {skills.categories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 2, fontSize: 9.5 }}>
                  {cat.name && <span style={{ fontWeight: 700 }}>{cat.name}: </span>}
                  <span style={{ color: '#222' }}>{cat.skills}</span>
                </div>
              ))}
            </>
          )}

          {section.type === 'certifications' && certifications && (
            <>
              <SectionTitle title="Certifications" color={accentColor} />
              {certifications.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 3 }}>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 9.5 }}>{item.name}</span>
                    {item.issuer && <span style={{ fontSize: 9.5, color: '#444' }}> · {item.issuer}</span>}
                  </span>
                  <span style={{ fontSize: 9.5, color: '#444', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.date}</span>
                </div>
              ))}
            </>
          )}

          {section.type === 'languages' && languages && (
            <>
              <SectionTitle title="Languages" color={accentColor} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 16px', fontSize: 9.5 }}>
                {languages.items.map((item) => (
                  <span key={item.id}><strong>{item.language}</strong> ({item.proficiency})</span>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
