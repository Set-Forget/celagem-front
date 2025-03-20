module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname
	},
	extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
	rules: {
		//indent: ["error", 2],
		"react-hooks/exhaustive-deps": "off",
		"@typescript-eslint/naming-convention": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "off",
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
	}
};
