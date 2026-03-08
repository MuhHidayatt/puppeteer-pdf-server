import express from "express"
import puppeteer from "puppeteer"

const app = express()

app.use(express.json({ limit: "10mb" }))

app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body

    if (!html) {
      return res.status(400).json({ error: "HTML is required" })
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })

    const page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: "networkidle0"
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }
    })

    await browser.close()

    res.set({
      "Content-Type": "application/pdf"
    })

    res.send(pdf)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "PDF generation failed" })
  }
})

app.listen(3000, () => {
  console.log("PDF server running on port 3000")
})