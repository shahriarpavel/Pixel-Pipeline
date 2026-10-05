import React, { useState } from 'react';
import type { FormEvent } from 'react';

type Platform = 'Discord' | 'X' | 'Steam';
type ImportSource = 'Manual' | 'GitHub' | 'GitLab' | 'Bitbucket';

type GitHubCommit = {
  sha: string;
  message: string;
  url: string;
};

type PipelineResult = {
  id: number;
  game: string;
  commit: string;
  platforms: Platform[];
  publishAt: string;
  caption: string;
  platformDrafts: { platform: Platform; text: string }[];
  devlog: string;
  clipPlan: string[];
  mediaName: string | null;
};

const defaultCommit = 'Added dash mechanic and improved controller feel';
const defaultPlatforms: Platform[] = ['Discord', 'X'];
const queueStorageKey = 'pixel-pipeline-queue';

const loadQueue = (): PipelineResult[] => {
  try {
    const savedQueue = window.localStorage.getItem(queueStorageKey);
    if (!savedQueue) return [];

    const parsedQueue: unknown = JSON.parse(savedQueue);
    return Array.isArray(parsedQueue) ? parsedQueue as PipelineResult[] : [];
  } catch {
    return [];
  }
};

const buildResult = (game: string, commit: string, platforms: Platform[], publishAt: string, mediaName: string | null): PipelineResult => {
  const cleanCommit = commit.trim().replace(/[.!?]+$/, '');
  const title = cleanCommit.charAt(0).toUpperCase() + cleanCommit.slice(1);
  const tags = ['#indiedev', '#gamedev', `#${game.replace(/[^a-z0-9]/gi, '')}`];
  const platformDrafts = platforms.map(platform => {
    if (platform === 'Discord') {
      return { platform, text: `Build update: ${title}.\n\nPlaytest this one and tell us how it feels.` };
    }
    if (platform === 'Steam') {
      return { platform, text: `${title} is now in the latest ${game} build. This update focuses on ${cleanCommit.toLowerCase()}, with more responsive gameplay ready for playtesting.` };
    }
    return { platform, text: `New ${game} build: ${title}.\n\nShipping small improvements every week. ${tags.join(' ')}` };
  });

  return {
    id: Date.now(),
    game,
    commit: cleanCommit,
    platforms,
    publishAt,
    caption: `New build drop: ${title}.\n\nSmall changes, better movement, one step closer to launch. ${tags.join(' ')}`,
    platformDrafts,
    devlog: `## ${title}\n\nIn this build of ${game}, we focused on ${cleanCommit.toLowerCase()}. The change is now ready for playtesting and feedback.`,
    clipPlan: [
      mediaName ? `Use the attached gameplay file: ${mediaName}` : 'Capture the first 3 seconds before the change',
      `Show the new behavior: ${cleanCommit.toLowerCase()}`,
      'End on the cleanest gameplay moment with the game name',
    ],
    mediaName,
  };
};

const PipelineStudio: React.FC = () => {
  const [game, setGame] = useState('Neon Orchard');
  const [commit, setCommit] = useState(defaultCommit);
  const [importSource, setImportSource] = useState<ImportSource>('Manual');
  const [repoUrl, setRepoUrl] = useState('');
  const [githubCommits, setGithubCommits] = useState<GitHubCommit[]>([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(defaultPlatforms);
  const [publishAt, setPublishAt] = useState('Today, 6:00 PM');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [queue, setQueue] = useState<PipelineResult[]>(loadQueue);
  const [notice, setNotice] = useState('');

  const togglePlatform = (platform: Platform) => {
    setPlatforms(current => current.includes(platform)
      ? current.filter(item => item !== platform)
      : [...current, platform]);
  };

  const handleFetchCommits = async () => {
    const host = importSource === 'GitHub' ? 'github.com' : importSource === 'GitLab' ? 'gitlab.com' : 'bitbucket.org';
    const match = repoUrl.trim().match(new RegExp(`^https?:\\/\\/${host.replace('.', '\\.') }\\/([^/]+)\\/([^/#?]+)\\/?$`, 'i'));
    if (!match) {
      setNotice(`Use a public ${importSource} URL with owner and repository.`);
      return;
    }

    setIsLoadingCommits(true);
    setNotice('Loading recent commits...');
    try {
      const project = `${match[1]}/${match[2]}`;
      const endpoint = importSource === 'GitHub'
        ? `https://api.github.com/repos/${project}/commits?per_page=5`
        : importSource === 'GitLab'
          ? `https://gitlab.com/api/v4/projects/${encodeURIComponent(project)}/repository/commits?per_page=5`
          : `https://api.bitbucket.org/2.0/repositories/${project}/commits?pagelen=5`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`${importSource} request failed`);
      const data: unknown = await response.json();
      const recentCommits: GitHubCommit[] = importSource === 'Bitbucket'
        ? (data as { values: Array<{ hash: string; links: { html: { href: string } }; message: string }> }).values.map(item => ({ sha: item.hash, message: item.message.split('\n')[0], url: item.links.html.href }))
        : (data as Array<{ id?: string; sha?: string; web_url?: string; html_url?: string; title?: string; message?: string; commit?: { message: string } }>).map(item => ({
          sha: item.id ?? item.sha ?? '',
          message: (item.title ?? item.message ?? item.commit?.message ?? '').split('\n')[0],
          url: item.web_url ?? item.html_url ?? '',
        }));
      setGithubCommits(recentCommits);
      setNotice(`${recentCommits.length} recent commits loaded.`);
    } catch {
      setNotice('Could not load this repository. Check the URL and make sure it is public.');
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const handleCommitFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const firstLine = String(reader.result ?? '').split('\n').map(line => line.trim()).find(Boolean);
      if (firstLine) {
        setCommit(firstLine.replace(/^[*\-\s]+/, '').replace(/^\w{7,40}\s+/, ''));
        setNotice(`Loaded commit text from ${file.name}.`);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!game.trim() || !commit.trim() || platforms.length === 0) {
      setNotice('Add a game name, commit message, and at least one platform.');
      return;
    }

    setResult(buildResult(game.trim(), commit, platforms, publishAt, mediaName));
    setNotice('Draft ready. Review it below, then schedule or export it.');
  };

  const handleSchedule = () => {
    if (!result) return;
    const nextQueue = [result, ...queue];
    try {
      window.localStorage.setItem(queueStorageKey, JSON.stringify(nextQueue));
      setQueue(nextQueue);
      setNotice(`Scheduled for ${result.publishAt}. Saved in this browser.`);
    } catch {
      setNotice('Could not save this update. Browser storage may be unavailable.');
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.caption);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = result.caption;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setNotice('Caption copied to clipboard.');
    } catch {
      setNotice('Copy failed. Select the caption manually.');
    }
  };

  const handleExport = () => {
    if (!result) return;
    const file = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.game.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-pipeline-draft.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Draft exported as JSON.');
  };

  return (
    <section id="studio" className="studio-section">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow mono">LOCAL PIPELINE STUDIO / READY</p>
          <h2>Ship a <span className="gradient-text">real update</span></h2>
          <p>Paste a commit, choose where it should go, and get a publish-ready content pack in seconds.</p>
        </div>

        <div className="studio-grid">
          <form className="glass-card studio-form reveal" onSubmit={handleGenerate}>
            <div className="form-heading">
              <span className="step-number">01</span>
              <div>
                <h3>Feed the pipeline</h3>
                <p className="muted">No account or API key needed for this local run.</p>
              </div>
            </div>

            <label htmlFor="import-source">Commit source <span className="optional-label">OPTIONAL</span></label>
            <select id="import-source" value={importSource} onChange={event => setImportSource(event.target.value as ImportSource)}>
              <option>Manual</option>
              <option>GitHub</option>
              <option>GitLab</option>
              <option>Bitbucket</option>
            </select>
            {importSource !== 'Manual' && <>
              <label htmlFor="github-repository">Public repository URL</label>
              <div className="github-import">
                <input id="github-repository" value={repoUrl} onChange={event => setRepoUrl(event.target.value)} placeholder={`https://${importSource.toLowerCase()}.com/owner/repository`} />
                <button type="button" className="btn btn-secondary github-button" onClick={handleFetchCommits} disabled={isLoadingCommits}>
                  {isLoadingCommits ? 'Loading...' : 'Fetch commits'}
                </button>
              </div>
              {githubCommits.length > 0 && (
                <div className="commit-list">
                  {githubCommits.map(item => (
                    <button type="button" className="commit-item" key={item.sha} onClick={() => setCommit(item.message)}>
                      <span>{item.message}</span>
                      <small className="mono">{item.sha.slice(0, 7)}</small>
                    </button>
                  ))}
                </div>
              )}
            </>}

            <label htmlFor="game-name">Game name</label>
            <input id="game-name" value={game} onChange={event => setGame(event.target.value)} placeholder="Your game title" />

            <label htmlFor="commit-message">Latest commit</label>
            <textarea id="commit-message" value={commit} onChange={event => setCommit(event.target.value)} rows={4} placeholder="What changed in this build?" />
            <div className="input-tools">
              <label className="file-button" htmlFor="commit-file">Load changelog / git log</label>
              <input id="commit-file" className="visually-hidden" type="file" accept=".txt,.md,.log" onChange={event => handleCommitFile(event.target.files?.[0])} />
              <span className="muted">TXT, MD, or LOG</span>
            </div>

            <label htmlFor="media-file">Gameplay image or video <span className="optional-label">OPTIONAL</span></label>
            <input id="media-file" type="file" accept="image/*,video/*" onChange={event => setMediaName(event.target.files?.[0]?.name ?? null)} />
            {mediaName && <p className="attachment-name mono">ATTACHED: {mediaName}</p>}

            <fieldset>
              <legend>Publish to</legend>
              <div className="platform-options">
                {(['Discord', 'X', 'Steam'] as Platform[]).map(platform => (
                  <label className={`platform-option ${platforms.includes(platform) ? 'selected' : ''}`} key={platform}>
                    <input type="checkbox" checked={platforms.includes(platform)} onChange={() => togglePlatform(platform)} />
                    <span>{platform === 'X' ? 'X / Twitter' : platform}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="publish-time">Schedule</label>
            <select id="publish-time" value={publishAt} onChange={event => setPublishAt(event.target.value)}>
              <option>Now</option>
              <option>Today, 6:00 PM</option>
              <option>Tomorrow, 10:00 AM</option>
              <option>Friday, 2:00 PM</option>
            </select>

            <button type="submit" className="btn btn-primary studio-submit">Generate content pack <span aria-hidden="true">-&gt;</span></button>
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </form>

          <div className="studio-output reveal">
            {result ? (
              <div className="glass-card result-card">
                <div className="result-header">
                  <div>
                    <p className="eyebrow mono">02 / OUTPUT</p>
                    <h3>{result.game} update pack</h3>
                  </div>
                  <span className="status-pill">DRAFT READY</span>
                </div>
                <div className="result-block">
                  <div className="result-label"><span>Social caption</span><button type="button" className="text-button" onClick={handleCopy}>Copy</button></div>
                  <p className="result-copy">{result.caption}</p>
                </div>
                <div className="result-block">
                  <div className="result-label"><span>Platform versions</span><span className="mono clip-duration">{result.platformDrafts.length} FORMATS</span></div>
                  <div className="platform-drafts">
                    {result.platformDrafts.map(draft => (
                      <div className="platform-draft" key={draft.platform}>
                        <span className="draft-platform mono">{draft.platform === 'X' ? 'X / TWITTER' : draft.platform}</span>
                        <p>{draft.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="result-block">
                  <div className="result-label"><span>Devlog draft</span></div>
                  <pre className="result-copy devlog-copy">{result.devlog}</pre>
                </div>
                <div className="clip-plan">
                  <div className="result-label"><span>GIF / clip direction</span><span className="mono clip-duration">15 SEC</span></div>
                  <ol>{result.clipPlan.map(step => <li key={step}>{step}</li>)}</ol>
                </div>
                <div className="result-actions">
                  <button type="button" className="btn btn-primary" onClick={handleSchedule}>Schedule update</button>
                  <button type="button" className="btn btn-secondary" onClick={handleExport}>Export JSON</button>
                </div>
                <p className="result-meta mono">TARGETS: {result.platforms.join(' / ')} <span>•</span> {result.publishAt}</p>
              </div>
            ) : (
              <div className="glass-card empty-output">
                <span className="empty-icon">++</span>
                <h3>Your content pack is waiting</h3>
                <p>Generate a draft to see the social caption, devlog, and clip direction here.</p>
              </div>
            )}

            <div className="queue-panel">
              <div className="queue-heading"><h3>Scheduled queue</h3><span className="mono">{queue.length.toString().padStart(2, '0')} ITEMS</span></div>
              {queue.length === 0 ? <p className="muted">Nothing scheduled yet. Your saved updates will appear here.</p> : queue.slice(0, 3).map(item => (
                <div className="queue-item" key={item.id}><span className="queue-dot"></span><span>{item.commit}</span><time>{item.publishAt}</time></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineStudio;