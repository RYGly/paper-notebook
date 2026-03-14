---
name: Genome Biology Researcher
description: A research assistant that uses Firecrawl to monitor the latest publications in Genome Biology and summarize the most relevant papers based on your background in cold tolerance, photosynthesis, inflorescence development, single-cell in plants, spatial transcriptome in plants, and yield related traits in maize.
---

# Genome Biology Researcher

## Purpose
This skill configures the agent to automatically scrape the recent publications from the journal Genome Biology and filter them based on your specific research expertise in cold tolerance, photosynthesis, inflorescence development, single-cell in plants, spatial transcriptome in plants, and yield related traits in maize.

## Prerequisites
- The **Firecrawl MCP Server** must be running locally (`docker compose up -d`) and configured in the `mcp_config.json`.

## Target Journal
- Genome Biology (https://genomebiology.biomedcentral.com/)

## Instructions for the Agent
When the user invokes this skill, follow these exact steps:

1. **Scrape Journal Pages:**
   Use the `firecrawl_scrape` tool (or `firecrawl_search`) to fetch the latest research articles from the Genome Biology journal.

2. **Filter & Select:** 
   Read the scraped content and identify all relevant papers based on the user's core research background. The core research interests to prioritize are:
   - **Abiotic Stress:** especially cold tolerance in plants.
   - **Plant Physiology:** photosynthesis and related traits.
   - **Plant Development:** inflorescence development.
   - **Single-Cell & Spatial Omics:** single-cell transcriptomics and spatial transcriptomics in plants.
   - **Crop Improvement:** yield related traits, especially in maize.
   - **RECENCY CONSTRAINT:** You MUST ONLY select papers from the most recent publication issue. Do not retrieve or select older papers from past years or previous issues. If using `firecrawl_search`, specifically query for the "latest issue" or current month/year to avoid retrieving older highly-cited papers.
3. **Fetch Abstracts:** 
   For each relevant paper, use the `firecrawl_scrape` tool to fetch its dedicated abstract page on the Genome Biology website to get the full abstract text and DOI.
3b. **Deduplicate Against Existing Papers:**
   Before presenting results, check the existing database at `docs/js/papers.json` in the repository. Read the file and extract all existing paper DOIs and titles. Cross-reference your candidate papers against this list — if a paper's DOI or title (case-insensitive) already exists in `papers.json`, **skip it and do not include it in the final results**. Only present papers that are genuinely new and not already tracked.
4. **Format Output:** 
   Present the final output using clear markdown headings and bullet points. For each paper, you MUST include:
   - The Journal Name, Title, and Authors
   - A concise 2-3 sentence summary of the abstract, highlighting the core biological/AI contribution
   - Why it is relevant to the user's specific research (e.g., "Relevant because it introduces a novel deep learning framework for plant genomics").
   - Direct markdown links to the abstract page.

## Example Output Format
```markdown
### 1. [Paper Title](https://genomebiology.biomedcentral.com/articles/XXXX) - *[Journal Name]*
*   **Authors:** Author 1, Author 2, etc.
*   **Abstract Summary:** [2-3 sentences summarising the abstract and main findings]
*   **Relevance:** [1 sentence explaining why it aligns with the user's background like cold tolerance or spatial transcriptomics]
*   **Link:** [Abstract Page](https://genomebiology.biomedcentral.com/articles/XXXX)
```

## Step 5 — Offer to Add to Notebook
After presenting the results, always ask:

> "Would you like to add any of these to your paper notebook website? Reply with the numbers (e.g. **1, 3**), **all**, or **none**."

Then follow the **Add to Notebook** skill (`.agents/skills/add_to_notebook/SKILL.md`) to handle selection, schema building, and automatic commit + push to GitHub.
