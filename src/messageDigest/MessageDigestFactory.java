package messageDigest;
import java.security.MessageDigest;

abstract class MessageDigestFactory {
	protected static String bytes2hex(byte bt[]){
        StringBuilder sb = new StringBuilder();
        for (byte b : bt) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
}

