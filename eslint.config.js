/**
 * Flat ESLint config using Next.js recommended settings.
 * See: https://nextjs.org/docs/app/api-reference/config/eslint
 * and ESLint v9 flat config migration guide.
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const next = require('eslint-config-next')

module.exports = [
    ...next,
    {
        rules: {
            // Enforce using error boundaries instead of try/catch around JSX
            'react-hooks/error-boundaries': 'error',
        },
    },
    {
        files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
        rules: {
            // Forbid direct usage of Supabase JS SDK in UI layers; use adapters/services instead
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@supabase/supabase-js'],
                            message: 'Import Supabase SDK only within src/lib/services or src/lib/supabase. Use service adapters in UI/routes.'
                        },
                    ],
                },
            ],
        },
    },
]
