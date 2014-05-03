package antySamy;
import java.io.File;

import org.owasp.validator.html.*;


public class AntySamyFilter {

	private static final String POLICY_FILE_LOCATION = "/var/lib/tomcat6/antisamy-slashdot-1.4.4.xml";
	private static Policy policy;
	
	AntySamyFilter(){
	}

	public static String getCleanHtml(String dirtyInput){
		AntiSamy as = new AntiSamy();  
		try {
			
			as.setPolicy(Policy.getInstance(new File(POLICY_FILE_LOCATION)));
			CleanResults cr = as.scan(dirtyInput); 
			String res = cr.getCleanHTML();
			if (res.equals("")) res= "含禁止字段的输入";
			return res;
		} catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}
}
