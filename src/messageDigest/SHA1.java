package messageDigest;
import java.security.MessageDigest;

public class SHA1 extends MessageDigestFactory {
	private MessageDigest md;
	public SHA1() {
		try{
			 md = MessageDigest.getInstance("SHA-1");
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	public String digest(String message){
			return bytes2hex(this.md.digest(message.getBytes()));
	}
}
