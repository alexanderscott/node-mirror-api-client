"use strict";

module.exports = [
    {
        text: 'What did you have for lunch?',
        speakableText: 'What did you eat? Bacon?',
        notification: { level: 'DEFAULT' },
        menuItems: [
            { action: 'REPLY' },
            { action: 'READ_ALOUD' },
            { action: 'SHARE' }
        ]
    },
    {
        text: 'Welcome to the Mirror API Node.js Quick Start',
        menuItems: [
            { action: 'READ_ALOUD' },
            { action: "DELETE" },
            { action: "SHARE" }
        ]
    },

    // Map rendering
    {
        html: '<article> <figure> <img src="glass://map?w=240&h=360&marker=0;42.369590, -71.107132&marker=1;42.36254,-71.08726&polyline=;42.36254, -71.08726,42.36297,-71.09364,42.36579,-71.09208,42.3697, -71.102,42.37105,-71.10104,42.37067,-71.1001,42.36561, -71.10406,42.36838,-71.10878,42.36968,-71.10703" height="360" width="240"> </figure> <section> <div class="text-auto-size"> <p class="yellow">12 minutes to home</p><p>Medium traffic on Broadway</p> </div> </section> </article>',
        menuItems: [
            { action: "DELETE" },
            { action: "SHARE" }
        ]
    }

];
