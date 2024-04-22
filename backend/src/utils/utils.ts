import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';

export default class Utils {
  public async generateOTP(count: number) {
    const code = otpGenerator.generate(count, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const salt = await bcrypt.genSalt(12);
    const signedCode = await bcrypt.hash(code, salt);

    return {
      code,
      signedCode,
    };
  }

  generateRandomString(length: number, prefix: string): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '-';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
