const REGEX = {
  AlphaNumUsDashSpace: "^[\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Pd} _-]+$", // AlphanumericWithUnderScoreDashSpace
  AlphaNumUsDashSpaceDotCurrency:
    "^[\\p{No}\\p{L}\\p{Sc}\\p{Nd}\\p{M}\\p{Z}_. -]+$", // AlphanumericWithUnderScoreDashDotSpaceCurrencySymbol
  AlphaNumDotColon: "^[\\p{L}\\p{Nd}\\p{M}\\p{Z}:.]+$", // AlphanumericWithDotColon
  AlphaNumUsBrackets: "^[\\p{L}\\p{Nd}\\p{M}\\p{Z}() -.*_]+$", // AlphaNumUnderscoreBrackets1
  AlphaNumBrackets: "^[\\p{Z}\\p{L}\\p{Nd}\\p{M} (\\)_.*-]+$", // AlphnaumericwithBrackets
  AllChars: "^[\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Sc}\\p{P}\\p{Sk}~+=|©°]*$", //	AllChars
  NumColon: "^[-+]?[\\p{Nd}:]+$", //	NumericWithColon
  NumPositive: "^[\\p{Nd}]*$", // NumericPositive
  Integer: "^[-+]?[\\p{Nd}]+$", // NumericPositiveNegative
  AlphaDotSpace: "^[\\p{L}\\p{M}\\p{Z}. ]*$", // AlphawithDotSpaceRegEx
  AlphaSpaceUs: "^[\\p{L}\\p{M}\\p{Z}\\p{Pd} _]*$", // AlphawithSpaceUnderscoreRegEx
  AlphaNospace: "^[\\p{L}\\p{M}]*$", // AlphaWithoutSpaceRegEx
  StartWithAlphaThenAlphaNumUsDash:
    "^[a-zA-Z][\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Pd}_-]*$", // StartWithAlphabetandAlphanumericWithUnderScoreDash
  StartWithAlphaThenAlphaNumAndOnlyUs:
    "^[a-zA-Z][\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Pd}_]*$", // StartWithAlphabetandAlphanumericWithUnderScoreDash
};

const validateRegex = (value, type) => {
  const regex = new RegExp(type, "u");
  return regex.test(value);
};

export { REGEX, validateRegex };
