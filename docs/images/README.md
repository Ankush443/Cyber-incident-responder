# System Architecture Diagram Generator

This directory contains files to generate the system architecture diagram for the Cyber-Incident Responder project.

## Files

- `architecture.html` - HTML/SVG based architecture diagram
- `generate.js` - Node.js script to convert the HTML to a PNG image
- `architecture-diagram.png` - The generated architecture diagram image (once created)

## How to Generate the Diagram

### Prerequisites

You need to have Node.js installed along with Puppeteer:

```bash
npm install puppeteer
```

### Generate the Diagram

Run the generator script:

```bash
node generate.js
```

This will:
1. Open the HTML file in a headless Chrome browser
2. Render the SVG diagram
3. Take a screenshot and save it as `architecture-diagram.png`

### Manual Generation (Alternative)

If you prefer to generate it manually:

1. Open the `architecture.html` file in a web browser
2. Use browser's screenshot feature (or press F12 and use the device toolbar screenshot)
3. Save the image

## Using the Diagram

Once generated, update the README.md file to point to the actual image:

```markdown
![System Architecture Diagram](docs/images/architecture-diagram.png)
``` 