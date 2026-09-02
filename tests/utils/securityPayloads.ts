/**
 * Security audit payloads for comprehensive input testing
 */
export const SECURITY_PAYLOADS = {
  xss: [
    "<script>alert('XSS-01')</script>",
    "<img src=x onerror=alert('XSS-02')>",
    "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/'/+/onmouseover=1/+/[*/[]/+alert(1)//'>",
    "<svg onload=alert(1)>",
    "\"><script>alert('XSS-03')</script>",
  ],
  noSqlInjection: [
    { "$gt": "" },
    { "$ne": null },
    { "$regex": ".*" },
    { "$where": "sleep(5000)" },
    "admin' || '1'=='1",
  ],
  sqlInjection: [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT 1, 'admin', 'password' --",
    "1' ORDER BY 1--+",
    "admin'--",
  ],
  fuzzing: {
    hugeString: "A".repeat(10000),
    specialChars: "!@#$%^&*()_+~`|}{[]:;?><,./",
    unicodeString: "᚛᚛ᚄᚑᚂᚐᚄ᚜᚜ 𝕿𝖍𝖊 𝖖𝖚𝖎𝖈𝖐 𝖇𝖗𝖔𝖜𝖓 𝖋𝖔𝖝 🦊🔥⚡ 健身房 ERP テスト",
    whitespaceString: "   \t\n\r   ",
    negativeNumber: -9999999,
    overflowNumber: 999999999999999,
  },
  invalidEmails: [
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Joe Smith <email@example.com>",
    "email.example.com",
    "email@example@example.com",
    "email@example..com",
  ],
  invalidPhones: [
    "123",
    "abcdefg",
    "++1-800-GYM",
    "0000000000000000000000",
  ],
};

