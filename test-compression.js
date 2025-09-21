#!/usr/bin/env node

/**
 * Test script to check if Brotli and gzip compression are working
 * Usage: node test-compression.js <your-domain>
 * Example: node test-compression.js https://your-site.workers.dev
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

async function testCompression(baseUrl) {
    const testFiles = [
        '/_astro/Welcome.BUDg93ke.js', // Your main JS bundle
        '/_astro/client.BYBrYqb_.js',  // React bundle
        '/', // HTML page
    ];

    console.log(`🧪 Testing compression for: ${baseUrl}\n`);

    for (const file of testFiles) {
        const url = new URL(file, baseUrl);
        
        console.log(`📁 Testing: ${file}`);
        
        // Test Brotli
        await testRequest(url, 'br', 'Brotli');
        
        // Test gzip
        await testRequest(url, 'gzip', 'Gzip');
        
        // Test no compression
        await testRequest(url, '', 'Uncompressed');
        
        console.log(''); // Empty line between files
    }
}

function testRequest(url, encoding, label) {
    return new Promise((resolve) => {
        const options = {
            method: 'HEAD', // Just get headers, not content
            headers: {}
        };
        
        if (encoding) {
            options.headers['Accept-Encoding'] = encoding;
        }

        const client = url.protocol === 'https:' ? https : http;
        
        const req = client.request(url, options, (res) => {
            const contentLength = res.headers['content-length'];
            const contentEncoding = res.headers['content-encoding'];
            const cacheControl = res.headers['cache-control'];
            
            console.log(`  ${label}:`);
            console.log(`    📏 Size: ${contentLength ? `${contentLength} bytes` : 'Unknown'}`);
            console.log(`    🗜️  Encoding: ${contentEncoding || 'none'}`);
            console.log(`    ⏰ Cache: ${cacheControl || 'none'}`);
            
            resolve();
        });
        
        req.on('error', (err) => {
            console.log(`  ${label}: ❌ Error - ${err.message}`);
            resolve();
        });
        
        req.end();
    });
}

// Get URL from command line argument
const url = process.argv[2];

if (!url) {
    console.log('❌ Please provide a URL to test');
    console.log('Usage: node test-compression.js <your-domain>');
    console.log('Example: node test-compression.js https://your-site.workers.dev');
    process.exit(1);
}

testCompression(url).catch(console.error);
