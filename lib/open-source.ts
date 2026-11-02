export interface OpenSourcePR {
  num: number
  title: string
}

export interface OpenSourceRepo {
  repo: string
  prs: OpenSourcePR[]
}

export interface OpenSourceOrg {
  key: string
  iconUrl: string
  label: string
  sub?: string
  name: string
  description: string
  siteUrl: string
  accent: string
  repos: OpenSourceRepo[]
}

// Every merged PR, not a sample: counts are derived from these lists, so a
// merge only shows up once its row is added here.
export const openSourceData: OpenSourceOrg[] = [
  {
    key: "antiwork",
    iconUrl: "https://assets.gumroad.com/assets/pink-icon-c5f5013768a1da41246e70403f02afc8b34ac89c20f3ba2dd0a01f3973027700.png",
    label: "antiwork",
    sub: "Gumroad · 2 repos",
    name: "Gumroad",
    description: "Creator commerce platform. Sell digital products, courses, and memberships. Now open-source under Antiwork (Sahil Lavingia).",
    siteUrl: "https://gumroad.com",
    accent: "#ff90e8",
    repos: [
      {
        repo: "antiwork/gumroad",
        prs: [
          // Imported by the Gumroad team from yashranaway/gumroad#5 and #6; the
          // squashed commits credit us as co-author, so they will not show in an
          // author: search.
          { num: 8681, title: "Cache the empty subdomain-redirect table and degrade on Redis errors" },
          { num: 8682, title: "Mark a product file's transcoded videos deleted along with the file" },
          { num: 2810, title: "Auto-suspend creators sharing ACH via stripe fingerprints" },
          { num: 3066, title: "Preserve offer-code discount for installments" },
          { num: 2384, title: "Migrate payouts to Inertia" },
          { num: 2270, title: "Auto-apply VAT ID to recurring subscription charges" },
          { num: 2769, title: "Add sendgrid resend fallback" },
          { num: 3337, title: "Remove VAT ID fallback logic after backfill" },
          { num: 3173, title: "Migrate bundle editing to Inertia" },
          { num: 2886, title: "Migrate the help center to Inertia" },
          { num: 2718, title: "Add IRAS test defaults for secretless test runs" },
          { num: 2511, title: "Add an Order ID field to admin purchase search" },
          { num: 2395, title: "Migrate affiliates to Inertia" },
          { num: 2491, title: "Fix performance issues in admin impersonation flow" },
          { num: 2259, title: "Skip the forced tip for 100% discount codes" },
          { num: 2353, title: "Count sales lost to DST in desktop analytics" },
          { num: 2317, title: "Migrate support" },
          { num: 1979, title: "Remove foreign key from installment_plan_snapshots" },
          { num: 1899, title: "Improve backfill price derivation" },
          { num: 1846, title: "Correct price protection on installment plans" },
        ],
      },
      {
        repo: "antiwork/gumroad-mobile",
        prs: [
          { num: 70, title: "Native table-of-contents navigation for multi-page products" },
        ],
      },
    ],
  },
  {
    key: "dodopayments",
    iconUrl: "https://github.com/dodopayments.png?size=128",
    label: "dodopayments",
    sub: "4 repos",
    name: "Dodo Payments",
    description: "YC-backed global payments infrastructure. Stripe-style API for emerging markets.",
    siteUrl: "https://dodopayments.com",
    accent: "#A0E636",
    repos: [
      {
        repo: "dodopayments/billingsdk",
        prs: [
          { num: 306, title: "Auto-discovery system for playground components" },
          { num: 283, title: "Add Stripe support for Fastify template" },
          { num: 338, title: "Update CI/CD for registry generation" },
          { num: 255, title: "Fix pricing-table responsiveness" },
          { num: 243, title: "Fix CI build warnings & overall cleanup" },
          { num: 333, title: "Fix the CLI registry URL and error logging" },
          { num: 332, title: "Fix clipping" },
          { num: 226, title: "Add CLI flags and centralize the framework/provider matrix" },
          { num: 230, title: "Make the billing settings component responsive" },
          { num: 188, title: "Add Fastify support" },
          { num: 189, title: "Fix the playground button" },
          { num: 177, title: "Fix playground live-edit reliability" },
          { num: 156, title: "Add playground integration with component preloading" },
          { num: 149, title: "Fix package manager commands and add bun to the docs" },
        ],
      },
      {
        repo: "dodopayments/dodo-discord-bot",
        prs: [
          { num: 1, title: "Welcoming revamp with embeds" },
          { num: 4, title: "Auto-thread feature" },
          { num: 3, title: "Ping command for latency metrics" },
        ],
      },
      {
        repo: "dodopayments/dodo-migrate",
        prs: [
          { num: 6, title: "Add Stripe provider integration" },
          { num: 7, title: "Add Coupons migration for Lemon Squeezy" },
          { num: 9, title: "Specify product types for Stripe migration" },
        ],
      },
      {
        repo: "dodopayments/dualmark",
        prs: [
          { num: 32, title: "Add @dualmark/sveltekit adapter" },
        ],
      },
    ],
  },
  {
    key: "omacom",
    iconUrl: "https://github.com/omacom.png?size=128",
    label: "omacom",
    sub: "Omarchy · 2 repos",
    name: "Omacom",
    description: "Beautiful, modern and opinionated Linux — Arch and Hyprland configured out of the box. ttfx is a parity-exact Rust port of terminaltexteffects, shipped as a single static binary.",
    siteUrl: "https://omacom.io",
    accent: "#f97316",
    repos: [
      {
        repo: "omacom/omarchy",
        prs: [
          { num: 6763, title: "Keep shell tests inside their fixtures" },
          { num: 6752, title: "Treat LVDS panels as internal displays" },
          { num: 6738, title: "Stop hybrid GPU mode queries from hanging" },
          { num: 6732, title: "Only offer video capture devices as webcams" },
          { num: 9129, title: "Ignore vendor hotkey keyboard devices" },
          { num: 10708, title: "Document recovery from broken session environment files" },
        ],
      },
      {
        repo: "omacom/ttfx",
        prs: [
          { num: 9, title: "Restore the cursor on SIGTERM" },
          { num: 4, title: "Rebuild effects when the terminal is resized" },
        ],
      },
    ],
  },
  {
    key: "t3code",
    iconUrl: "https://github.com/pingdotgg.png?size=128",
    label: "pingdotgg/t3code",
    name: "T3 Code",
    description: "An agent harness control surface from Ping.gg. Drive Claude Code, Codex, Cursor and OpenCode from mobile, web, or desktop.",
    siteUrl: "https://t3.codes",
    accent: "#e11d48",
    repos: [
      {
        repo: "pingdotgg/t3code",
        prs: [
          { num: 14319, title: "Refresh provider discovery after CLI updates" },
          { num: 11381, title: "Release preview hosts after unanswered requests" },
          { num: 10606, title: "Stop cancelled OpenCode text generation sessions" },
          { num: 10585, title: "Release relay install locks on cancellation" },
          { num: 10584, title: "Retry failed SQLite statement preparations" },
          { num: 10574, title: "Prevent stale branch selections from restoring files" },
          // Opened by t3dotgg as a rebase of #10313; the commit is ours and the
          // PR body credits it, so it will not show in an author: search.
          { num: 10424, title: "Skip disabled settlement lookups" },
          { num: 10315, title: "Keep the newest shared usage scan" },
          { num: 10311, title: "Classify workspace previews by literal filenames" },
          { num: 10310, title: "Honor disabled usage hub polling" },
          { num: 10308, title: "Preserve Codex reset credits during usage updates" },
          { num: 10303, title: "Link the repository security reporting policy" },
          { num: 8751, title: "Allow local-only worktree bases" },
          { num: 8750, title: "Bound OpenCode version probes" },
          { num: 8634, title: "Skip IDE detection during Claude probes" },
          { num: 8630, title: "Avoid stale file writes on close" },
          { num: 4470, title: "Keep the server alive when a response write hits a dead socket" },
          { num: 4469, title: "Limit physical key fallback to non-Latin layout output" },
          { num: 4468, title: "Keep block code plain when copying from rendered markdown" },
          { num: 4466, title: "Skip user hooks during Claude capability probes" },
          { num: 23435, title: "Preserve Claude monthly spend through CLIProxy" },
          { num: 23414, title: "Match webhook existence filters on wildcard objects" },
          { num: 23441, title: "Recover cached agent daemons after exit" },
          { num: 23440, title: "Forward empty ACP plan replacements" },
          { num: 23438, title: "Include browser trace failures in diagnostics" },
          { num: 23434, title: "Serialize concurrent profile clears" },
          { num: 23430, title: "Preserve hyphens in prerelease versions" },
          { num: 23421, title: "Preserve byte-order marks in Git diff contents" },
        ],
      },
    ],
  },
  {
    key: "cap",
    iconUrl: "https://github.com/CapSoftware.png?size=128",
    label: "CapSoftware/Cap",
    name: "Cap",
    description: "The open-source Loom alternative. Record, edit and share screen recordings from a desktop app built in Rust.",
    siteUrl: "https://cap.so",
    accent: "#4785FF",
    repos: [
      {
        repo: "CapSoftware/Cap",
        prs: [
          { num: 2877, title: "Scope notification read updates to their recipient" },
          { num: 2902, title: "Sign published MP4 storage keys" },
          { num: 2678, title: "Recover footage after an early muxer restart" },
          { num: 2893, title: "Finish recording jobs after transcription failures" },
          { num: 2888, title: "Time out hung render farm audio engines" },
          { num: 2612, title: "Apply audio sync offsets during playback" },
          { num: 2617, title: "Keep cancelled GIF exports from leaving a partial file" },
          { num: 2676, title: "Serialize settings store writes" },
          { num: 2613, title: "Preserve chroma at odd frame edges" },
          { num: 2685, title: "Count characters, not bytes, at caption boundaries" },
          { num: 2684, title: "Keep late camera timestamps in the FFmpeg decoder" },
          { num: 2683, title: "Keep legacy captions that end at the timeline end" },
          { num: 2681, title: "Show fullscreen titles placed at the end of the video" },
          { num: 2680, title: "Emit JSON for recording validation errors in the CLI" },
          { num: 2679, title: "Keep an idle cursor in view when auto zoom starts" },
          { num: 2677, title: "Retime mask keyframes when clip speed changes" },
          { num: 2675, title: "Load general settings with one file read" },
          { num: 2615, title: "Keep audio in place when trimming a track's start" },
          { num: 2611, title: "Recrop image backgrounds when output size changes" },
          { num: 2610, title: "Normalize Windows recording asset paths" },
          { num: 2609, title: "Count buffered timestamp gaps only once" },
          { num: 2496, title: "Decode settings library thumbnails through the decode pool" },
          { num: 2495, title: "Check migration keys without parsing the config twice" },
          { num: 2485, title: "Build tray thumbnails from the Recents thumbnail cache" },
          { num: 2481, title: "Sum waveform peaks over slices instead of per sample" },
          { num: 3338, title: "Ignore cursor movement in timeline cuts for auto zoom" },
          { num: 2747, title: "Transcribe only the audio the timeline keeps" },
          { num: 2742, title: "Keep off-frame screenshot annotations in exports" },
          { num: 3332, title: "Save screenshots with long or colliding names" },
          { num: 3344, title: "Stage Whisper model downloads" },
          { num: 3339, title: "Remember previous recordings folders" },
          { num: 3346, title: "Delete recordings with damaged upload state" },
          { num: 3345, title: "Keep library actions tied to their recording" },
          { num: 3214, title: "Translate appearance options" },
          { num: 3212, title: "Keep reopened camera windows on screen" },
          { num: 3211, title: "Exclude unfinished pauses from audio tails" },
          { num: 3210, title: "Preserve stereo system audio on Linux" },
          { num: 3207, title: "Lazy-load the share limit overlay" },
          { num: 3206, title: "Avoid rebuilding unchanged transcript rows" },
          { num: 3205, title: "Join share-page download permission checks" },
          { num: 3204, title: "Remove shares when deleting a video" },
          { num: 3203, title: "Overlap independent reads in the mobile Caps list" },
          { num: 3202, title: "Batch access checks for Caps grid analytics" },
          { num: 3201, title: "Check file import folder ownership" },
          { num: 3199, title: "Skip notifications for replies to your own comments" },
          { num: 3189, title: "Trim overlapping resampler samples" },
          { num: 3054, title: "Clear stale converter selection on invalid input" },
          { num: 3065, title: "Apply the resolution limit to X11 display and area capture" },
          { num: 3052, title: "Discard speed tool recording when playback fails" },
          { num: 3063, title: "Refresh every library view and the tray after deleting a recording" },
          { num: 3059, title: "Count only uploaded parts in share progress" },
          { num: 2887, title: "Stop cancelled video jobs reporting success" },
          { num: 3064, title: "Revoke Pro access when removing the last organization seat" },
          { num: 3117, title: "Compare undo snapshots without building JSON trees" },
          { num: 3105, title: "Load space and folder pages in fewer database round trips" },
          { num: 3103, title: "Borrow presets when rendering the menu" },
          { num: 3066, title: "Scale text wrap allowance with output resolution" },
          { num: 3060, title: "Keep checking uploads after status errors" },
          { num: 3058, title: "Decode transcription audio in comma-decimal locales" },
          { num: 3057, title: "Ignore stale profile responses after sign-in" },
          { num: 3053, title: "Keep folder parents in the same space" },
          { num: 3055, title: "Retain recordings until all matching uploads finish" },
          { num: 3051, title: "Freeze duration when recording stops" },
          { num: 2900, title: "Open projects with incomplete system audio timestamps" },
          { num: 2906, title: "Keep partially visible X11 windows selectable" },
          { num: 2909, title: "Restore shortcuts after preview clicks" },
          { num: 2907, title: "Preserve MOV destinations on failed exports" },
          { num: 2889, title: "Sync staged configs and clean up failed writes" },
          { num: 2826, title: "Show waveforms on clips that aren't at 1x" },
          { num: 2876, title: "Verify signatures against the original request body" },
          { num: 2878, title: "Avoid duplicate shares when adding Caps to folders" },
          { num: 2882, title: "Preserve audio output and report stream failures" },
          { num: 2883, title: "Check private space access before sharing Caps" },
          { num: 2884, title: "Seek the first transcript search result" },
          { num: 2886, title: "Release capture when the comment recorder loses its source" },
          { num: 2899, title: "Ignore stale account responses after sign-out" },
          { num: 2895, title: "Preserve AAC quality for high sample rate inputs" },
          { num: 2903, title: "Avoid panics for non-ascii hex colours" },
          { num: 2963, title: "Reject project config commands outside a recording" },
          { num: 2972, title: "Apply the macbook notch setting to new studio recordings" },
          { num: 2966, title: "Skip undo entries for drags that end where they started" },
          { num: 2964, title: "Keep an offscreen playhead in view when zooming" },
          { num: 2962, title: "Keep the last cursor shape when a click confirms it" },
          { num: 2908, title: "Drive camera size during zoom from the rendered scale" },
          { num: 2967, title: "Keep the custom domain when removing it from vercel fails" },
          { num: 2905, title: "Keep overlays under the pointer near preview edges" },
          { num: 2904, title: "Let cursor smoothing settle after movement ends" },
          { num: 2897, title: "Ignore cancelled share export completions" },
          { num: 2896, title: "Honor height edits in locked crops" },
          { num: 2890, title: "Keep camera preview alive when blur GPU setup fails" },
          { num: 2824, title: "Cap scene exit transitions at the scene's length" },
          { num: 2894, title: "Restore preview audio after short cuts" },
          { num: 2892, title: "Validate mobile reply parents" },
          { num: 2891, title: "Declare final Drive size at part boundaries" },
          { num: 2901, title: "Revalidate Cap pages after mobile password changes" },
          { num: 2898, title: "Clean up failed video outputs" },
          { num: 2885, title: "Avoid restarting processing during thumbnail generation" },
          { num: 2881, title: "Preserve newer status during recording polls" },
          { num: 2880, title: "Keep daily analytics labels on their UTC date" },
          { num: 2879, title: "Preserve recording dimensions in link previews" },
          { num: 2832, title: "Keep area capture size exact at fractional display scales" },
          { num: 2821, title: "Sort scene segments when a project loads" },
          { num: 2828, title: "Cancel the Linux Instant start when stop is pressed during the countdown" },
          { num: 2827, title: "Validate custom server URLs with the URL parser" },
          { num: 2825, title: "Keep text intact when applying older presets" },
          { num: 2835, title: "Keep redo when a caption or keyboard timing field doesn't change" },
          { num: 2834, title: "Keep segment resizes from overlapping their neighbours" },
          { num: 2833, title: "Keep caption word timings consistent after text edits" },
          { num: 2829, title: "Keep mask keyframes in place when splitting or trimming" },
          { num: 2817, title: "Keep timestamp seeks while the video is still loading" },
          { num: 2830, title: "Keep import progress updating during steady uploads" },
          { num: 2818, title: "Count the same videos the dashboard lists" },
          { num: 2749, title: "Drop erased keys from keyboard overlay segments" },
          { num: 2750, title: "Show the final frame when seeking to the timeline end" },
          { num: 2746, title: "Clip overlapping music once after mixing" },
          { num: 2743, title: "Align upload chunks for Google Drive" },
          { num: 2682, title: "Fit imported portrait videos to a vertical output" },
          { num: 2483, title: "Share the project config across frame uniforms" },
          { num: 2744, title: "Keep new timeline segments inside their gap" },
          { num: 2748, title: "Lay out the camera from the current frame's size" },
          { num: 2745, title: "Sanitize suggested export file names" },
        ],
      },
    ],
  },
  {
    key: "digitalocean",
    iconUrl: "https://github.com/digitalocean.png?size=128",
    label: "digitalocean/gradient-typescript",
    name: "DigitalOcean",
    description: "Cloud infrastructure for developers. Droplets, Kubernetes, managed databases.",
    siteUrl: "https://digitalocean.com",
    accent: "#0080FF",
    repos: [
      {
        repo: "digitalocean/gradient-typescript",
        prs: [
          { num: 8, title: "waitForDatabase polling helper for knowledge bases" },
        ],
      },
    ],
  },
  {
    key: "ghostfolio",
    iconUrl: "https://github.com/ghostfolio.png?size=128",
    label: "ghostfolio/ghostfolio",
    name: "Ghostfolio",
    description: "Open-source wealth-management dashboard for self-directed investors.",
    siteUrl: "https://ghostfol.io",
    accent: "#36B37E",
    repos: [
      {
        repo: "ghostfolio/ghostfolio",
        prs: [
          { num: 5656, title: "Preselect first search result in assistant" },
        ],
      },
    ],
  },
  {
    key: "different-ai",
    iconUrl: "https://github.com/different-ai.png?size=128",
    label: "different-ai/openwork",
    name: "different.ai",
    description: "Open-source AI dev tooling. Makers of opencode and openwork.",
    siteUrl: "https://different.ai",
    accent: "#7C3AED",
    repos: [
      {
        repo: "different-ai/openwork",
        prs: [
          { num: 1567, title: "Forward --opencode-log-level to managed opencode serve" },
        ],
      },
    ],
  },
]

export function mergedCount(org: OpenSourceOrg): number {
  return org.repos.reduce((n, r) => n + r.prs.length, 0)
}

export const openSourceTotals = {
  merged: openSourceData.reduce((n, o) => n + mergedCount(o), 0),
  orgs: openSourceData.length,
  repos: openSourceData.reduce((n, o) => n + o.repos.length, 0),
}
