export function validateEmail(mail: string): boolean {
    // Validates email format: {handle}@{domain}.{tld}
    // where handle, domain, and tld can be any non-empty content
    const emailRegex = /^.+@.+\..+$/;
    return emailRegex.test(mail);
}