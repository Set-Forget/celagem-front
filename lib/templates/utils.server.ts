'use server'

import puppeteer from 'puppeteer';
import React from 'react';
import { TemplateMap, templates } from './templates';

async function generatePDFFromComponent(component: React.ReactElement): Promise<Buffer> {
  const { renderToStaticMarkup } = await import('react-dom/server');

  const htmlContent = renderToStaticMarkup(component);

  const fullHtml = `<!DOCTYPE html>${htmlContent}`;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

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

  const component = React.createElement(
    TemplateComponent as React.ComponentType<{ data: typeof options.data }>,
    { data: options.data }
  );

  const pdfBuffer = await generatePDFFromComponent(component);

  return pdfBuffer.toString('base64');
}