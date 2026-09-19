import { Link } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-screen">
        <span className="muted">Loading CareerHub…</span>
      </div>
    );
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="app-logo" style={{ color: '#12263a', padding: 0 }}>
          <span className="mark">C</span>
          CareerHub
        </Link>
        <div className="links">
          {user ? (
            <Link to="/dashboard">
              <Button type="primary">Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button>Log in</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Create account</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="section-kicker">Resume versions + applications</div>
          <h1>Know exactly which resume you sent to which job.</h1>
          <p className="lead">
            CareerHub stores every resume version you create, tracks internships and jobs you apply
            to, and keeps the two connected. Tailor a version for a job description with AI — without
            inventing experience you do not have.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard">
                <Button type="primary" size="large">
                  Open CareerHub
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button type="primary" size="large">
                    Get started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large">I already have an account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-card">
          <div className="row">
            <div>
              <strong>ABC Corp</strong>
              <div className="muted">Software Engineer Intern</div>
            </div>
            <Tag color="blue">Applied</Tag>
          </div>
          <div className="row">
            <span className="muted">Resume submitted</span>
            <strong>Java Resume v3</strong>
          </div>
          <div className="row">
            <span className="muted">Applied</span>
            <span>10 Sep 2026</span>
          </div>
          <div className="row">
            <span className="muted">Library</span>
            <span>3 resume versions</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-kicker">What you get</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', marginTop: 8 }}>Built for the messy application process</h2>
        <div className="feature-grid" style={{ marginTop: 20 }}>
          <article className="feature">
            <h3>Application tracker</h3>
            <p className="muted">
              Company, role, JD, status, notes, and dates in one place. Move from Saved to Selected
              without losing context.
            </p>
          </article>
          <article className="feature">
            <h3>Resume library</h3>
            <p className="muted">
              Upload PDF versions to Cloudinary. Name them clearly. See how many jobs each version
              was used for.
            </p>
          </article>
          <article className="feature">
            <h3>Honest AI tailoring</h3>
            <p className="muted">
              Gemini rewrites and reorders only what is already on your resume. It will not invent
              skills, projects, or metrics.
            </p>
          </article>
        </div>
      </section>

      <section className="how">
        <div className="section-kicker">How it works</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', marginTop: 8 }}>Four steps, nothing extra</h2>
        <div className="steps" style={{ marginTop: 20 }}>
          <div className="step">
            <div className="num">1</div>
            <strong>Upload resumes</strong>
            <p className="muted">Keep a general version, a Java version, an analytics version…</p>
          </div>
          <div className="step">
            <div className="num">2</div>
            <strong>Add the job</strong>
            <p className="muted">Save the posting and pick which resume you submitted.</p>
          </div>
          <div className="step">
            <div className="num">3</div>
            <strong>Track status</strong>
            <p className="muted">Assessment, interview, rejected, or selected — at a glance.</p>
          </div>
          <div className="step">
            <div className="num">4</div>
            <strong>Tailor with AI</strong>
            <p className="muted">Paste a JD, generate a cleaner version, download the PDF.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-box">
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', marginTop: 0 }}>Start with one resume and one job.</h2>
            <p style={{ opacity: 0.85, marginBottom: 0 }}>
              Local MongoDB, your Cloudinary account, and a Gemini API key are all you need.
            </p>
          </div>
          <Link to={user ? '/dashboard' : '/register'}>
            <Button size="large">{user ? 'Go to dashboard' : 'Create a free account'}</Button>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">CareerHub MVP · Track applications. Remember every resume.</footer>
    </div>
  );
}
