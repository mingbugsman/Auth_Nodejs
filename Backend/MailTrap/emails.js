const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates");
const { mailtrapClient, sender } = require("./mailtrap.config");



const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const res = await mailtrapClient.send({
            from : sender,
            to : recipient,
            subject : "Verify your email",
            html : VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category : "Email Verification"
        })

        console.log("Email sent successfully", res);
    } catch (error) {
        console.log(`Error sending verification `, error);
        throw new Error(`Error sending verification email : ${error}`);
    }
}


const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];
    
    try {
        const res = await mailtrapClient.send({
            from : sender, 
            to : recipient,
            template_uuid : "0e164910-4107-4902-b7c2-b5e3c990ebea",
            template_variables : {
                company_info_name : "TM TECH COMPANY",
                name : name        
            }
        });
        console.log("Welcome Email sent successfully ", res);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail
}