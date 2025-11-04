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
]
