"use server";

import React from "react";
import { TemplateMap, templates } from "./templates";

async function launchBrowser() {
    const isServerless = !!process.env.VERCEL;
    if (isServerless) {
        const chromium = require("chrome-aws-lambda");
        const puppeteer = require("puppeteer-core");
        return puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
    } else {
        const puppeteer = require("puppeteer");
        return puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    }
}

async function generatePDFFromComponent(component: React.ReactElement): Promise<Buffer> {
    const { renderToStaticMarkup } = require("react-dom/server");

    const html = `<!DOCTYPE html>${renderToStaticMarkup(component)}`;
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return Buffer.from(pdfBuffer);
}

export async function generatePDFBuffer<K extends keyof TemplateMap>(options: {
    templateName: K;
    data: TemplateMap[K];
}): Promise<string> {
    const TemplateComponent = templates[options.templateName];
    if (!TemplateComponent) {
        throw new Error(`No se encontró la plantilla: ${options.templateName}`);
    }

    const element = React.createElement(TemplateComponent as React.ComponentType<{ data: TemplateMap[K] }>, {
        data: options.data,
    });

    const buffer = await generatePDFFromComponent(element);
    return buffer.toString("base64");
}
