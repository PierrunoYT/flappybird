// Responsive Design Test Script
// This script tests the responsive behavior of the Flappy Bird game

console.log('=== Flappy Bird Responsive Design Test ===');

// Test different screen sizes
const testCases = [
    {
        name: 'Mobile Portrait',
        width: 375,
        height: 667,
        expected: 'Title, canvas, high score visible. Instructions hidden.'
    },
    {
        name: 'Mobile Landscape',
        width: 667,
        height: 375,
        expected: 'Landscape layout, high score positioned absolutely.'
    },
    {
        name: 'Tablet Portrait',
        width: 768,
        height: 1024,
        expected: 'Larger fonts, all UI elements visible.'
    },
    {
        name: 'Tablet Landscape',
        width: 1024,
        height: 768,
        expected: 'Desktop-like layout, optimal spacing.'
    },
    {
        name: 'Desktop',
        width: 1920,
        height: 1080,
        expected: 'Full UI, larger canvas, proper scaling.'
    },
    {
        name: 'Ultra-wide',
        width: 2560,
        height: 1080,
        expected: 'Centered content, max-width constraints.'
    }
];

// Test media queries
const mediaQueries = [
    {
        query: '(max-height: 550px)',
        description: 'Small height screens - hide instructions'
    },
    {
        query: '(max-height: 400px)',
        description: 'Very small screens'
    },
    {
        query: '(orientation: landscape)',
        description: 'Landscape mode'
    },
    {
        query: '(min-width: 1024px) and (min-height: 768px)',
        description: 'Large screens / Desktop'
    },
    {
        query: '(min-width: 600px) and (max-width: 1023px) and (orientation: portrait)',
        description: 'Tablet portrait'
    },
    {
        query: '(max-width: 375px) and (max-height: 667px)',
        description: 'Extra small screens (mobile phones)'
    },
    {
        query: '(min-aspect-ratio: 21/9)',
        description: 'Ultra-wide screens'
    },
    {
        query: '(min-height: 900px) and (orientation: portrait)',
        description: 'Very tall screens'
    },
    {
        query: '(max-width: 800px) and (orientation: landscape)',
        description: 'Small landscape screens'
    },
    {
        query: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
        description: 'High DPI screens'
    }
];

console.log('\n--- Testing Media Queries ---');
mediaQueries.forEach((mq, index) => {
    const mql = window.matchMedia(mq.query);
    console.log(`${index + 1}. ${mq.description}`);
    console.log(`   Query: ${mq.query}`);
    console.log(`   Matches: ${mql.matches}`);
});

console.log('\n--- Testing Responsive Functions ---');

// Test the resize functionality
function testResize() {
    console.log('Testing resize functionality...');
    
    // Check if resizeCanvas function exists
    if (typeof resizeCanvas === 'function') {
        console.log('✓ resizeCanvas function exists');
    } else {
        console.log('✗ resizeCanvas function not found');
    }
    
    // Check if handleResize function exists
    if (typeof handleResize === 'function') {
        console.log('✓ handleResize function exists');
    } else {
        console.log('✗ handleResize function not found');
    }
    
    // Test canvas scaling
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        console.log(`✓ Canvas found: ${canvas.width}x${canvas.height}`);
    } else {
        console.log('✗ Canvas not found');
    }
}

// Run tests when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, running responsive tests...');
    testResize();
    
    // Test responsive behavior on resize
    console.log('\n--- Testing Window Resize ---');
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    console.log(`Original window size: ${originalWidth}x${originalHeight}`);
    
    // Simulate different screen sizes
    testCases.forEach((testCase, index) => {
        console.log(`\nTest ${index + 1}: ${testCase.name} (${testCase.width}x${testCase.height})`);
        console.log(`Expected: ${testCase.expected}`);
        
        // Note: We can't actually resize the window in this test,
        // but we can verify the media queries work
        const widthQuery = window.matchMedia(`(max-width: ${testCase.width}px)`);
        const heightQuery = window.matchMedia(`(max-height: ${testCase.height}px)`);
        console.log(`Width <= ${testCase.width}: ${widthQuery.matches}`);
        console.log(`Height <= ${testCase.height}: ${heightQuery.matches}`);
    });
    
    console.log('\n=== Responsive Design Test Complete ===');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testCases, mediaQueries, testResize };
}