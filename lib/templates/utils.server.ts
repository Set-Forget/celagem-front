"use server";

import React from "react";
import { TemplateMap, templates } from "./templates";

async function launchBrowser() {
    const isServerless = Boolean(process.env.VERCEL);

    if (isServerless) {
        // en Vercel (o cualquier entorno serverless)
        const chromiumPkg = await import("chrome-aws-lambda");
        const puppeteerCorePkg = await import("puppeteer-core");

        // chrome-aws-lambda y puppeteer-core son CJS, por eso miramos .default
        const chromium = chromiumPkg.default ?? chromiumPkg;
        const puppeteer = puppeteerCorePkg.default ?? puppeteerCorePkg;

        return puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
    } else {
        // en tu máquina local
        const puppeteerPkg = await import("puppeteer");
        const puppeteer = puppeteerPkg.default ?? puppeteerPkg;

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
