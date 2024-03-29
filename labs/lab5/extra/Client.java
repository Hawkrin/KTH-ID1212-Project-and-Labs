import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Client {
  private static String REMOTE_NAME = SendMail.class.getName();

    private Client() {}

    public static void main(String[] args) {

      String from = "malcolml@kth.se";
      String to = "malcolm.liljedahl94@gmail.com"; 
  
      String sendingHost = "smtp.kth.se";
      int sendingPort = 587;

        String host = (args.length < 1) ? null : args[0];
        try {
            Registry registry = LocateRegistry.getRegistry(host);
            SendMail stub = (SendMail) registry.lookup(REMOTE_NAME);
            
            stub.sendEmails(to, from, sendingHost, sendingPort);
            System.out.println("email sent");
        } catch (Exception e) {
            System.err.println("Client exception: " + e.toString());
            e.printStackTrace();
        }
    }
}