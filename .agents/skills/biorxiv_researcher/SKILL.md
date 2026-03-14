---
name: bioRxiv Researcher
description: A research assistant that uses Firecrawl to monitor the latest preprints on bioRxiv (specifically Bioinformatics, Genetics, Evolutionary Biology sections) and summarize papers based on your background in cold tolerance, photosynthesis, inflorescence development, single-cell in plants, spatial transcriptome in plants, and yield related traits in maize.
---

# bioRxiv Researcher

## Purpose
Monitor the latest preprints posted on bioRxiv and surface the most relevant ones based on the user's research interests.

## Prerequisites
- Firecrawl MCP Server must be running

## Important: Use RSS Feeds, NOT Collection Pages

**Do NOT** scrape `https://www.biorxiv.org/collection/*` — bioRxiv blocks this with anti-bot protection.

**Instead**, use the official bioRxiv RSS feeds, which are publicly accessible and return full paper metadata:

| Section | RSS URL |
|---|---|
| Bioinformatics | `https://connect.biorxiv.org/biorxiv_xml.php?subject=bioinformatics` |
| Genetics | `https://connect.biorxiv.org/biorxiv_xml.php?subject=genetics` |
| Evolutionary Biology | `https://connect.biorxiv.org/biorxiv_xml.php?subject=evolutionary-biology` |
| Genomics | `https://connect.biorxiv.org/biorxiv_xml.php?subject=genomics` |
| Plant Biology | `https://connect.biorxiv.org/biorxiv_xml.php?subject=plant-biology` |

## Instructions for the Agent
## Important Agent Instructions
- **NEVER use the browser_subagent** or open the browser to fetch papers.
- ALWAYS use the  or  tool from the Firecrawl MCP server. Wait for the server to be available if it's not immediately found.


### Step 1 — Scrape RSS Feeds
Use `firecrawl_scrape` with `formats: ["markdown"]` on the RSS URLs above (scrape all sections in parallel):

```
firecrawl_scrape(url="https://connect.biorxiv.org/biorxiv_xml.php?subject=bioinformatics", formats=["markdown"])
firecrawl_scrape(url="https://connect.biorxiv.org/biorxiv_xml.php?subject=genetics", formats=["markdown"])
firecrawl_scrape(url="https://connect.biorxiv.org/biorxiv_xml.php?subject=evolutionary-biology", formats=["markdown"])
firecrawl_scrape(url="https://connect.biorxiv.org/biorxiv_xml.php?subject=genomics", formats=["markdown"])
firecrawl_scrape(url="https://connect.biorxiv.org/biorxiv_xml.php?subject=plant-biology", formats=["markdown"])
```

Each RSS feed returns ~30 recent entries. Each entry includes: **title**, **abstract** (in `<description>`), **authors** (in `<dc:creator>`), **DOI** (in `<dc:identifier>`), and **date** (in `<dc:date>`).

### Step 2 — Filter for Relevance
Parse the combined results and select papers relevant to the user's research interests:

**High priority topics** (rate 4-5):
- DNA/RNA/biological language models and foundation models applied to genomics or sequences
- Plant genomics: crops (maize, rice, wheat, soybean, etc.), *Arabidopsis*, pangenomes, regulatory elements
- Whole-genome duplication, polyploidy, genome evolution in plants
- AI/deep learning for genome annotation, gene regulation, variant effect prediction

**Medium priority topics** (rate 3):
- Sequence modeling more broadly (protein LMs, single-cell foundation models)
- Population genetics and phylogenomics with computational methods
- Cross-species comparative genomics
- Novel genome assembly or annotation tools (T2T, Hi-C, long-read)
- AI for functional genomics: epigenomics, chromatin accessibility, spatial transcriptomics

**Exclude** (not relevant):
- Medical/clinical studies without genomic/AI angle
- Non-plant organisms unless clearly AI/LM related
- Purely statistical or epidemiology methods unrelated to sequence analysis

### Step 3 — Deduplicate
Load `docs/js/papers.json` and check existing `doi` fields. Skip any paper whose DOI already appears in `papers.json`.

### Step 4 — Present Results
Show the top relevant papers (aim for 5-10) in this format:

```
Found X relevant new preprints on bioRxiv.

1. **[Title]** | bioRxiv, [YYYY-MM-DD]
   Authors: [First Author et al.]
   DOI: [doi]
   → [1-2 sentence summary of why this is relevant]

2. ...
```

Then ask: "Would you like to add any of these to your notebook? Reply with numbers (e.g. 1, 3), **all**, or **none**."

### Step 5 — Add Selected Papers
If the user selects papers, invoke the **Add to Notebook** skill to build full `papers.json` entries and commit.

Use `"journal": "bioRxiv"` for all entries. The DOI from the RSS feed (`dc:identifier`) is in the format `doi:10.XXXX/...` — strip the `doi:` prefix to get the clean DOI string. The abstract is in the `<description>` field of each RSS item.

## Notes
- RSS feeds typically contain the last 30 papers posted per section. For older papers, use `firecrawl_search` with targeted queries.
- The `onlyMainContent: true` flag is fine to use with these RSS feeds.
- Do not use `proxy: "stealth"` — it is not needed and wastes credits; the RSS feeds are fully public.
