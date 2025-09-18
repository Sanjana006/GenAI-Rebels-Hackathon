# 📜 Generative AI for Demystifying Legal Documents – GenAI Rebels

## 🚀 Overview

Our prototype transforms the way people interact with legal documents. It takes dense, jargon-heavy text and turns it into a clear, interactive experience that anyone can understand. Key clauses, deadlines, and risks are automatically highlighted, and users can explore their documents, ask questions, and receive actionable guidance step by step. By making legal information accessible and practical, our prototype empowers everyday users to make informed decisions confidently, bridging the gap between legal complexity and real-world clarity.

## 💡 Problem Statement

Most existing legal tools stop at summarizing or drafting documents and are built for lawyers or businesses, leaving everyday users overwhelmed by jargon. Our solution flips this model: it’s **user-first, not lawyer-first**. Instead of static summaries, we turn dense legal text into an interactive, easy-to-navigate experience that:

* Helps users quickly understand documents.
* Extracts actionable insights.
* Makes law accessible and useful for everyone.

## 🎯 Key Features

* **Simplifies Legal Text:** Converts jargon-heavy documents into plain, easy-to-understand language.
* **Highlights Key Insights:** Automatically identifies clauses, obligations, deadlines, and risks.
* **Interactive Guidance:** Provides step-by-step explanations, answers questions, and gives actionable recommendations.
* **Role-Based Views (Persona Mode):** Custom explanations for tenants, landlords, founders, or investors.
* **Spot the Traps:** Color-coded heatmaps highlight hidden risks like penalties or liabilities.
* **Play Out the ‘What Ifs’:** Simulates consequences of missing deadlines or breaking clauses.

## 📊 Use Case Diagram

The use-case diagram illustrates how clients interact with the system. Clients can upload legal documents, receive simplified text, and view key insights such as clauses, deadlines, and risks. Advanced features extend this functionality — users can analyze risks through a heatmap, filter information based on their role (tenant, landlord, founder, or investor), ask questions, and simulate different “what if” scenarios. The diagram captures the user journey from document upload to receiving interactive guidance, showcasing how the system bridges complexity and usability.

![Use Case Diagram](/Assets/use-case.png)
## 🏗️ System Architecture

The architecture diagram shows the flow of data through our solution. Users upload documents through a **React.js frontend**, which communicates with a **Python backend (Flask/FastAPI)**. Uploaded PDFs are processed using **PyPDF2/pdfplumber** for text extraction. The extracted content is orchestrated through **LangChain**, which integrates with the **Gemini API** for natural language simplification, summarization, and Q\&A. For efficient retrieval and large document handling, we employ **Pinecone/Elasticsearch** as vector databases. The processed results are then sent back to the frontend, giving users simplified text, insights, and interactive guidance.

![Architecture Diagram](/Assets/architecture.png)

## 🛠️ Technologies

* **Frontend:** React.js – for a clean, interactive interface.
* **Backend:** Python (Flask / FastAPI) – lightweight API server.
* **APIs:** Gemini API – simplify legal text, provide summaries, and interactive Q\&A.
* **PDF Parsing:** PyPDF2 / pdfplumber – extract text from PDFs.
* **RAG Framework:** LangChain – for large document handling.
* **Search & Retrieval:** ElasticSearch / Pinecone – semantic search capabilities.

## 💸 Business Model

### 1. Freemium (User Acquisition 🎣)

* **Offer:** 1 document/month (up to 5 pages) free.
* **Target:** First-time users facing legal documents.
* **Goal:** Build trust and drive adoption.

### 2. B2C Subscription (Direct Revenue 💼)

* **Offer:** Unlimited analysis, “What If” mode, persona views, document history.
* **Target:** Freelancers, tenants/landlords, small business owners.
* **Price Point:** \₹830/month or \₹8,250/year.

### 3. B2B2C Licensing (Scaling & Integration 🚀)

* **Offer:** API licensing for platforms (e.g., Zillow, Upwork, Clerky, Stripe Atlas).
* **Goal:** Integrate demystification engine directly into existing ecosystems.

## 🌍 Impact & Mission

Every year, millions of Indians — from tenants to freelancers — sign complex contracts without legal guidance, simply because legal services are unaffordable. This isn’t just a market gap; it’s an **empowerment gap**. Our mission is to bridge this divide by transforming dense legal jargon into accessible clarity, placing the **power of understanding back into the hands of the user**.

## 👩‍💻 Team

We are **Team GenAI Rebels**, a group of M.Sc. Data Science students from **DAU, Gandhinagar**:

* Sanjana Nathani
* Divya Mashruwala
* Rudra Pandit
* Urvi Kava
* Meet Gandhi

---

✨ *Demystifying legal documents with clarity, confidence, and control.*
