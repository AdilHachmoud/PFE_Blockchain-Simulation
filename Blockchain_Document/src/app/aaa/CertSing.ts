
import { PDFNet } from '@pdftron/pdfnet-node';
import * as fs from "fs";
var qr = require('qr-image');
PDFNet.initialize('demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
class DocumentSign {
	public doc: any;
	public certificate: any;
	public file: any;
	public timestamp: any;
    // ---------------- Preparation --------------------
    // Récuperer le document dont on veut signer
    constructor(doc : any, certificate : any) {
        PDFNet.initialize('demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
        this.doc = PDFNet.PDFDoc.createFromFilePath(doc);
        this.certificate = certificate;
        this.timestamp = Date.now();

    }
    async Sign() {
        await PDFNet.initialize('demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
            let page1 = this.doc.getPage(1);
            let builder = PDFNet.ElementBuilder.create();
            // Writer est le responsable d'ajouter du texte,d'image,... à un block de builder
            let writer = PDFNet.ElementWriter.create();

            /*---------------- Ajout d'une E-Signature --------------------*/

            let certification_sig_field = this.doc.createDigitalSignatureField('Certificate');
            certification_sig_field.setDocumentPermissions(PDFNet.DigitalSignatureField.DocumentPermissions.e_annotating_formfilling_signing_allowed);
            let widgetAnnot = PDFNet.SignatureWidget.createWithDigitalSignatureField(this.doc, new PDFNet.Rect(parseFloat((page1.getPageWidth()).toString()) - 200, parseFloat((page1.getPageHeight()).toString()) - 750, parseFloat((page1.getPageWidth()).toString()) - 30, parseFloat((page1.getPageHeight()).toString()) - 800), certification_sig_field);
            page1.annotPushBack(widgetAnnot);
            var fields_to_lock = ['asdf_test_field'];
            certification_sig_field.setFieldPermissions(PDFNet.DigitalSignatureField.FieldPermissions.e_include, fields_to_lock);
            certification_sig_field.certifyOnNextSave(this.certificate, 'ahmedahmed');
            // Ajouter les Permissions à la signature
            (await
        // Ajouter les Permissions à la signature
        writer).beginOnPage(page1);
            let element = (await builder).createTextBeginWithFont(await PDFNet.Font.create(this.doc, PDFNet.Font.StandardType1Font.e_times_roman), 20);
            (await writer).writeElement(await element);
            element = (await builder).createNewTextRun('');
            (await element).setTextMatrixEntries(0.5, 0, 0, 0.5, parseFloat((page1.getPageWidth()).toString()) - 190, parseFloat((page1.getPageHeight()).toString()) - 760);
            (await writer).writeElement(await element);

            var options = {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 0.9,
                margin: 0,
                color: {
                    dark: "#010599FF",
                    light: "#FFBF60FF"
                }
            }
            let qr_svg = qr.imageSync("omar", options);

            let signatureDate = certification_sig_field.getSigningTime();
            element = (await builder).createNewTextRun('Date: ' + signatureDate.year + '/' + signatureDate.month + '/' + signatureDate.day + ' at ' + signatureDate.hour + ':' + signatureDate.minute + ':' + signatureDate.second);
            // element.setPosAdjustment(15);
            (await
        // element.setPosAdjustment(15);
        element).setTextMatrixEntries(0.5, 0, 0, 0.5, parseFloat((page1.getPageWidth()).toString()) - 190, parseFloat((page1.getPageHeight()).toString()) - 775);

            (await builder).createImage
            ;(await writer).writeElement(await element);

            fs.writeFileSync('./my-qr-code.png', qr_svg);
            let img = PDFNet.Image.createFromFile(this.doc, './my-qr-code.png');

            element = (await builder).createImageScaled(await img, 300, 600, 200, -150);
            (await writer).writeElement(await element);
            (await writer).writeElement(await (await builder).createTextEnd());

            (await writer).end(); // save changes to the current page
            this.doc.pageRemove(this.doc.getPageIterator(1));
            this.doc.pagePushBack(page1);



            this.doc.save('mm.pdf', PDFNet.SDFDoc.SaveOptions.e_remove_unused);

            PDFNet.runWithCleanup(this.Sign, 'demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
        }
        // Récuperer la page dont on veut signer

    // creer le builder qui va ajouter des blocks à la page


    ///////////////////////////////

    /////////////////////////////////////////
    public async verify() {
        await PDFNet.initialize('demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
        let in_docpath = 'mm.pdf';
        let in_public_key_file_path = this.certificate;
        let doc1 = PDFNet.PDFDoc.createFromFilePath(in_docpath);
        (await doc1).initSecurityHandler();
        console.log('==========');
        let opts = PDFNet.VerificationOptions.create(PDFNet.VerificationOptions.SecurityLevel.e_compatibility_and_archiving);
        (await opts).addTrustedCertificateUString(in_public_key_file_path, PDFNet.VerificationOptions.CertificateTrustFlag.e_default_trust + PDFNet.VerificationOptions.CertificateTrustFlag.e_certification_trust);
        // Add trust root to store of trusted certificates contained in VerificationOptions.
        let digsig_fitr = (await doc1).getDigitalSignatureFieldIteratorBegin();
        console.log(digsig_fitr);
        var verification_status = true;
        for (; (await digsig_fitr).hasNext(); (await digsig_fitr).next()) {
            let curr = (await digsig_fitr).current();
            let result = (await curr).verify(await opts);
            if (await (await result).getVerificationStatus()) {
                console.log('Signature verified, objnum: ' + (await ((await curr).getSDFObj())).getObjNum());
            } else {
                console.log('Signature verification failed, objnum: ' + (await ((await curr).getSDFObj())).getObjNum());
                verification_status = false;
            }

            switch (await (await result).getDigestAlgorithm()) {
                case PDFNet.DigestAlgorithm.Type.e_SHA1:
                    console.log('Digest algorithm: SHA-1');
                    break;
                case PDFNet.DigestAlgorithm.Type.e_SHA256:
                    console.log('Digest algorithm: SHA-256');
                    break;
                case PDFNet.DigestAlgorithm.Type.e_SHA384:
                    console.log('Digest algorithm: SHA-384');
                    break;
                case PDFNet.DigestAlgorithm.Type.e_SHA512:
                    console.log('Digest algorithm: SHA-512');
                    break;
                case PDFNet.DigestAlgorithm.Type.e_RIPEMD160:
                    console.log('Digest algorithm: RIPEMD-160');
                    break;
                case PDFNet.DigestAlgorithm.Type.e_unknown_digest_algorithm:
                    console.log('Digest algorithm: unknown');
                    break;
            }

            console.log('Detailed verification result: \n\t' +
                (await result).getDocumentStatusAsString() + '\n\t' +
                (await result).getDigestStatusAsString() + '\n\t' +
                (await result).getTrustStatusAsString() + '\n\t' +
                (await result).getPermissionsStatusAsString());

            let changes = (await result).getDisallowedChanges();
            for (var i = 0; i < (await changes).length; ++i) {
                let change = changes[i];
                console.log('\tDisallowed change: ' + change.getTypeAsString() + ', objnum: ' + change.getObjNum());
            }

            // Get and print all the detailed trust-related results, if they are available.
            if (await (await result).hasTrustVerificationResult()) {
                let trust_verification_result = await (await result).getTrustVerificationResult();
                console.log(await trust_verification_result.wasSuccessful() ? 'Trust verified.' : 'Trust not verifiable.');
                console.log(trust_verification_result.getResultString());

                let tmp_time_t = trust_verification_result.getTimeOfTrustVerification();
                switch (await trust_verification_result.getTimeOfTrustVerificationEnum()) {
                    case PDFNet.VerificationOptions.TimeMode.e_current:
                        console.log('Trust verification attempted with respect to current time (as epoch time):' + tmp_time_t);
                        break;
                    case PDFNet.VerificationOptions.TimeMode.e_signing:
                        console.log('Trust verification attempted with respect to signing time (as epoch time): ' + tmp_time_t);
                        break;
                    case PDFNet.VerificationOptions.TimeMode.e_timestamp:
                        console.log('Trust verification attempted with respect to secure embedded timestamp (as epoch time): ' + tmp_time_t);
                        break;
                }

                let cert_path = trust_verification_result.getCertPath();
                if ((await cert_path).length == 0) {
                    console.log('Could not print certificate path.');
                } else {
                    console.log('Certificate path:');
                    for (var i = 0; i < (await cert_path).length; i++) {
                        console.log('\tCertificate:');
                        let full_cert = cert_path[i];
                        console.log('\t\tIssuer names:');
                        let issuer_dn = (full_cert.getIssuerField()).getAllAttributesAndValues();
                        for (var j = 0; j < issuer_dn.length; j++) {
                            console.log('\t\t\t' + issuer_dn[j].getStringValue());
                        }
                        console.log('\t\tSubject names:');
                        let subject_dn = (full_cert.getSubjectField()).getAllAttributesAndValues();
                        for (var j = 0; j < subject_dn.length; j++) {
                            console.log('\t\t\t' + subject_dn[j].getStringValue());
                        }
                        console.log('\t\tExtensions:');
                        let extension_dn = full_cert.getExtensions();
                        for (var j = 0; j < extension_dn.length; j++) {
                            console.log('\t\t\t' + extension_dn[j].toString());
                        }
                    }
                }
            }
            console.log(result);

        }
        PDFNet.runWithCleanup(this.verify, 'demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170');
    }


    ////////////////////////////////////////////////////////////////

}
PDFNet.initialize('demo:omaralami230@gmail.com:7b01f4ab020000000092768e068e8737e8b8c939452e7892e0470df170')
let a = new DocumentSign('CV.pdf','certificatea.pfx');
a.Sign();

