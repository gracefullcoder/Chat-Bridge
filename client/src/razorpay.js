import { toast } from "react-toastify";

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function displayRazorpay({userId,totalAmount, paymentUrl, userName,successUrl,updateChanges,setMakePay}) {
    
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const fetchPayment = await fetch(paymentUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ totalAmount })
    });

    const result = await fetchPayment.json();

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    const { amount, id: order_id, currency } = result;

    const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: amount.toString(),
        currency: currency,
        name: userName,
        description: "Chat Transaction",
        image: 'https://ik.imagekit.io/vaibhav11/Koe_Cafe/Additional/tr:w-40,h-40/logo1.jpg?updatedAt=1721420177935',
        order_id: order_id,
        handler: async function (response) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                userId:userId
            };
            console.log(data);

            const fetchOrder = await fetch(successUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const orderResult = await fetchOrder.json();

            if (fetchOrder.ok) {
                updateChanges();
            }else{
                setMakePay(false);
            }
            toastMessage(orderResult);
        },
        prefill: {
            name: "user",
            email: "vaibhavgupta10987@gmail.com",
            contact: "8780770435",
        },
        notes: {
            address: "SVNIT Bhabha Bhawan",
        },
        theme: {
            color: "#61dafb",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

}

export default displayRazorpay;
