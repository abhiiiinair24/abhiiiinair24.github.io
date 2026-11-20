# abhiiiinair24.github.io

Source for my portfolio at https://abhiiiinair24.github.io/. It uses plain HTML, CSS, and a small optional script, with no build step.

```
index.html    all page content (sections: #software-engineering, #ai-ml, #experience, #contact)
styles.css    layout and colors (edit the variables in :root to change the palette)
script.js     optional: highlights the nav link for the section in view
404.html      GitHub Pages "not found" page
favicon.svg   tab icon
.nojekyll     tells GitHub Pages to serve files as-is
```

## Editing

- **Add a project card:** copy an existing `<article class="card">` block in `index.html` and edit the text.
- **Add a case study:** copy an `<article class="case">` block. Give it a unique `id` if you want to link to it.
- **Preview locally:** run `python3 -m http.server 8000` in this folder, then open http://localhost:8000.
