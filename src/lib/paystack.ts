import fetch from "node-fetch";

export async function issueRefund(transactionRef: string): Promise<boolean> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY is not defined");
    return false;
  }

  try {
    const response = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction: transactionRef,
      }),
    });

    const data: any = await response.json();

    if (response.ok && data.status === true) {
      console.log(`Successfully issued refund for transaction: ${transactionRef}`);
      return true;
    } else {
      console.error(`Failed to issue refund for ${transactionRef}:`, data.message);
      return false;
    }
  } catch (error) {
    console.error("Error communicating with Paystack Refund API:", error);
    return false;
  }
}
