// ============================================================================
// Adobe Photoshop ExtendScript (.jsx) - Live TypeLayer Injector
// Target Master Artwork: 7days_flyer.psd
// ============================================================================
#target photoshop
app.bringToFront();

(function() {
    // 1. Lock Ruler & Type units to PIXELS to prevent coordinate drift
    var origRulerUnits = app.preferences.rulerUnits;
    var origTypeUnits = app.preferences.typeUnits;

    try {
        app.preferences.rulerUnits = Units.PIXELS;
        app.preferences.typeUnits = TypeUnits.PIXELS;

        // 2. Cascading Font Matcher
        function applyFontSafe(textItem, preferredPSName, fallbackFamily) {
            if (preferredPSName) {
                try {
                    textItem.font = preferredPSName;
                    return;
                } catch (e1) {}
            }

            if (fallbackFamily) {
                var lowerTarget = fallbackFamily.toLowerCase();
                for (var i = 0; i < app.fonts.length; i++) {
                    var f = app.fonts[i];
                    if (f.name.toLowerCase().indexOf(lowerTarget) !== -1 ||
                        f.postScriptName.toLowerCase().indexOf(lowerTarget) !== -1) {
                        try {
                            textItem.font = f.postScriptName;
                            return;
                        } catch (e2) {}
                    }
                }
            }

            try {
                textItem.font = "Arial-BoldMT";
                return;
            } catch (e3) {}

            try {
                textItem.font = "ArialMT";
            } catch (e4) {}
        }

        // 3. Locate or Open Base PSD Document
        var doc = null;
        try {
            if (app.documents.length > 0 && app.activeDocument.name === "7days_flyer.psd") {
                doc = app.activeDocument;
            }
        } catch (err) {}

        if (!doc) {
            var psdFile = new File("C:/Users/QING/Desktop/Qing/cubicle/output/7days_flyer.psd");
            if (psdFile.exists) {
                doc = app.open(psdFile);
            } else {
                alert("Target PSD document not found at: C:/Users/QING/Desktop/Qing/cubicle/output/7days_flyer.psd");
                return;
            }
        }

        // 4. Create Editable Typography Group at Top of Stack
        var textGroup = doc.layerSets.add();
        textGroup.name = "Editable Typography";

        // --- TypeLayer 1: "FORENQUIRIES..08034925799," ---
        try {
            var tLayer_0 = textGroup.artLayers.add();
            tLayer_0.kind = LayerKind.TEXT;
            tLayer_0.name = "FORENQUIRIES..08034925799,";

            var tItem_0 = tLayer_0.textItem;
            tItem_0.kind = TextType.POINTTEXT;
            tItem_0.contents = "FORENQUIRIES..08034925799,08023146699";
            tItem_0.size = 14;
            tItem_0.position = [515, 2015];
            tItem_0.tracking = 60;
            tItem_0.capitalization = TextCase.ALLCAPS;
            tItem_0.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_0, "Montserrat-Bold", "Arial-BoldMT");

            var col_0 = new SolidColor();
            col_0.rgb.red = 243;
            col_0.rgb.green = 231;
            col_0.rgb.blue = 223;
            tItem_0.color = col_0;
        } catch (layerErr_0) {}

        // --- TypeLayer 2: "NAME:7DaysMarathonFasting&" ---
        try {
            var tLayer_1 = textGroup.artLayers.add();
            tLayer_1.kind = LayerKind.TEXT;
            tLayer_1.name = "NAME:7DaysMarathonFasting&";

            var tItem_1 = tLayer_1.textItem;
            tItem_1.kind = TextType.POINTTEXT;
            tItem_1.contents = "NAME:7DaysMarathonFasting&Prayer";
            tItem_1.size = 20;
            tItem_1.position = [995, 1949];
            tItem_1.tracking = 0;
            tItem_1.capitalization = TextCase.NORMAL;
            tItem_1.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_1, "Montserrat-Regular", "ArialMT");

            var col_1 = new SolidColor();
            col_1.rgb.red = 251;
            col_1.rgb.green = 243;
            col_1.rgb.blue = 239;
            tItem_1.color = col_1;
        } catch (layerErr_1) {}

        // --- TypeLayer 3: "GOFAMINTASEESE,OGUNSTATE" ---
        try {
            var tLayer_2 = textGroup.artLayers.add();
            tLayer_2.kind = LayerKind.TEXT;
            tLayer_2.name = "GOFAMINTASEESE,OGUNSTATE";

            var tItem_2 = tLayer_2.textItem;
            tItem_2.kind = TextType.POINTTEXT;
            tItem_2.contents = "GOFAMINTASEESE,OGUNSTATE";
            tItem_2.size = 28;
            tItem_2.position = [139, 1940];
            tItem_2.tracking = 60;
            tItem_2.capitalization = TextCase.ALLCAPS;
            tItem_2.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_2, "Montserrat-Black", "Arial Black");

            var col_2 = new SolidColor();
            col_2.rgb.red = 254;
            col_2.rgb.green = 251;
            col_2.rgb.blue = 237;
            tItem_2.color = col_2;
        } catch (layerErr_2) {}

        // --- TypeLayer 4: "ACCT.NO:1225580508IIACCESS" ---
        try {
            var tLayer_3 = textGroup.artLayers.add();
            tLayer_3.kind = LayerKind.TEXT;
            tLayer_3.name = "ACCT.NO:1225580508IIACCESS";

            var tItem_3 = tLayer_3.textItem;
            tItem_3.kind = TextType.POINTTEXT;
            tItem_3.contents = "ACCT.NO:1225580508IIACCESSBANK";
            tItem_3.size = 20;
            tItem_3.position = [1000, 1920];
            tItem_3.tracking = 0;
            tItem_3.capitalization = TextCase.ALLCAPS;
            tItem_3.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_3, "Montserrat-Regular", "ArialMT");

            var col_3 = new SolidColor();
            col_3.rgb.red = 251;
            col_3.rgb.green = 244;
            col_3.rgb.blue = 241;
            tItem_3.color = col_3;
        } catch (layerErr_3) {}

        // --- TypeLayer 5: "NAME:SevenDaysMarathonGofa" ---
        try {
            var tLayer_4 = textGroup.artLayers.add();
            tLayer_4.kind = LayerKind.TEXT;
            tLayer_4.name = "NAME:SevenDaysMarathonGofa";

            var tItem_4 = tLayer_4.textItem;
            tItem_4.kind = TextType.POINTTEXT;
            tItem_4.contents = "NAME:SevenDaysMarathonGofamint";
            tItem_4.size = 18;
            tItem_4.position = [997, 1871];
            tItem_4.tracking = 0;
            tItem_4.capitalization = TextCase.NORMAL;
            tItem_4.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_4, "Montserrat-Regular", "ArialMT");

            var col_4 = new SolidColor();
            col_4.rgb.red = 251;
            col_4.rgb.green = 243;
            col_4.rgb.blue = 241;
            tItem_4.color = col_4;
        } catch (layerErr_4) {}

        // --- TypeLayer 6: "ACCT.NO:2018373202IIFIRSTB" ---
        try {
            var tLayer_5 = textGroup.artLayers.add();
            tLayer_5.kind = LayerKind.TEXT;
            tLayer_5.name = "ACCT.NO:2018373202IIFIRSTB";

            var tItem_5 = tLayer_5.textItem;
            tItem_5.kind = TextType.POINTTEXT;
            tItem_5.contents = "ACCT.NO:2018373202IIFIRSTBANK";
            tItem_5.size = 18;
            tItem_5.position = [997, 1842];
            tItem_5.tracking = 60;
            tItem_5.capitalization = TextCase.ALLCAPS;
            tItem_5.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_5, "Montserrat-Regular", "ArialMT");

            var col_5 = new SolidColor();
            col_5.rgb.red = 251;
            col_5.rgb.green = 243;
            col_5.rgb.blue = 241;
            tItem_5.color = col_5;
        } catch (layerErr_5) {}

        // --- TypeLayer 7: "AUG. 30TH - 5TH SEPT.2026" ---
        try {
            var tLayer_6 = textGroup.artLayers.add();
            tLayer_6.kind = LayerKind.TEXT;
            tLayer_6.name = "AUG. 30TH - 5TH SEPT.2026";

            var tItem_6 = tLayer_6.textItem;
            tItem_6.kind = TextType.POINTTEXT;
            tItem_6.contents = "AUG. 30TH - 5TH SEPT.2026";
            tItem_6.size = 54;
            tItem_6.position = [138, 1871];
            tItem_6.tracking = 0;
            tItem_6.capitalization = TextCase.ALLCAPS;
            tItem_6.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_6, "BebasNeue", "Impact");

            var col_6 = new SolidColor();
            col_6.rgb.red = 215;
            col_6.rgb.green = 251;
            col_6.rgb.blue = 4;
            tItem_6.color = col_6;
        } catch (layerErr_6) {}

        // --- TypeLayer 8: "REGISTRATION: NGN 10,OO0" ---
        try {
            var tLayer_7 = textGroup.artLayers.add();
            tLayer_7.kind = LayerKind.TEXT;
            tLayer_7.name = "REGISTRATION: NGN 10,OO0";

            var tItem_7 = tLayer_7.textItem;
            tItem_7.kind = TextType.POINTTEXT;
            tItem_7.contents = "REGISTRATION: NGN 10,OO0";
            tItem_7.size = 25;
            tItem_7.position = [996, 1812];
            tItem_7.tracking = 0;
            tItem_7.capitalization = TextCase.ALLCAPS;
            tItem_7.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_7, "Montserrat-Bold", "Arial-BoldMT");

            var col_7 = new SolidColor();
            col_7.rgb.red = 253;
            col_7.rgb.green = 248;
            col_7.rgb.blue = 235;
            tItem_7.color = col_7;
        } catch (layerErr_7) {}

        // --- TypeLayer 9: "GENERALOVERSEER" ---
        try {
            var tLayer_8 = textGroup.artLayers.add();
            tLayer_8.kind = LayerKind.TEXT;
            tLayer_8.name = "GENERALOVERSEER";

            var tItem_8 = tLayer_8.textItem;
            tItem_8.kind = TextType.POINTTEXT;
            tItem_8.contents = "GENERALOVERSEER";
            tItem_8.size = 12;
            tItem_8.position = [256, 1582];
            tItem_8.tracking = 60;
            tItem_8.capitalization = TextCase.ALLCAPS;
            tItem_8.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_8, "Montserrat-Bold", "Arial-BoldMT");

            var col_8 = new SolidColor();
            col_8.rgb.red = 225;
            col_8.rgb.green = 202;
            col_8.rgb.blue = 190;
            tItem_8.color = col_8;
        } catch (layerErr_8) {}

        // --- TypeLayer 10: "E. O. ABINA" ---
        try {
            var tLayer_9 = textGroup.artLayers.add();
            tLayer_9.kind = LayerKind.TEXT;
            tLayer_9.name = "E. O. ABINA";

            var tItem_9 = tLayer_9.textItem;
            tItem_9.kind = TextType.POINTTEXT;
            tItem_9.contents = "E. O. ABINA";
            tItem_9.size = 25;
            tItem_9.position = [252, 1552];
            tItem_9.tracking = 0;
            tItem_9.capitalization = TextCase.ALLCAPS;
            tItem_9.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_9, "Montserrat-Bold", "Arial-BoldMT");

            var col_9 = new SolidColor();
            col_9.rgb.red = 254;
            col_9.rgb.green = 250;
            col_9.rgb.blue = 242;
            tItem_9.color = col_9;
        } catch (layerErr_9) {}

        // --- TypeLayer 11: "PASTOR DR." ---
        try {
            var tLayer_10 = textGroup.artLayers.add();
            tLayer_10.kind = LayerKind.TEXT;
            tLayer_10.name = "PASTOR DR.";

            var tItem_10 = tLayer_10.textItem;
            tItem_10.kind = TextType.POINTTEXT;
            tItem_10.contents = "PASTOR DR.";
            tItem_10.size = 21;
            tItem_10.position = [254, 1513];
            tItem_10.tracking = 60;
            tItem_10.capitalization = TextCase.ALLCAPS;
            tItem_10.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_10, "Montserrat-Regular", "ArialMT");

            var col_10 = new SolidColor();
            col_10.rgb.red = 249;
            col_10.rgb.green = 233;
            col_10.rgb.blue = 222;
            tItem_10.color = col_10;
        } catch (layerErr_10) {}

        // --- TypeLayer 12: "CHAIRMAN" ---
        try {
            var tLayer_11 = textGroup.artLayers.add();
            tLayer_11.kind = LayerKind.TEXT;
            tLayer_11.name = "CHAIRMAN";

            var tItem_11 = tLayer_11.textItem;
            tItem_11.kind = TextType.POINTTEXT;
            tItem_11.contents = "CHAIRMAN";
            tItem_11.size = 14;
            tItem_11.position = [1150, 1488];
            tItem_11.tracking = 60;
            tItem_11.capitalization = TextCase.ALLCAPS;
            tItem_11.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_11, "Montserrat-Bold", "Arial-BoldMT");

            var col_11 = new SolidColor();
            col_11.rgb.red = 243;
            col_11.rgb.green = 231;
            col_11.rgb.blue = 227;
            tItem_11.color = col_11;
        } catch (layerErr_11) {}

        // --- TypeLayer 13: "P.B.EWENLA" ---
        try {
            var tLayer_12 = textGroup.artLayers.add();
            tLayer_12.kind = LayerKind.TEXT;
            tLayer_12.name = "P.B.EWENLA";

            var tItem_12 = tLayer_12.textItem;
            tItem_12.kind = TextType.POINTTEXT;
            tItem_12.contents = "P.B.EWENLA";
            tItem_12.size = 25;
            tItem_12.position = [1150, 1460];
            tItem_12.tracking = 60;
            tItem_12.capitalization = TextCase.ALLCAPS;
            tItem_12.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_12, "Montserrat-Bold", "Arial-BoldMT");

            var col_12 = new SolidColor();
            col_12.rgb.red = 254;
            col_12.rgb.green = 250;
            col_12.rgb.blue = 244;
            tItem_12.color = col_12;
        } catch (layerErr_12) {}

        // --- TypeLayer 14: "PASTOR" ---
        try {
            var tLayer_13 = textGroup.artLayers.add();
            tLayer_13.kind = LayerKind.TEXT;
            tLayer_13.name = "PASTOR";

            var tItem_13 = tLayer_13.textItem;
            tItem_13.kind = TextType.POINTTEXT;
            tItem_13.contents = "PASTOR";
            tItem_13.size = 22;
            tItem_13.position = [1152, 1421];
            tItem_13.tracking = 60;
            tItem_13.capitalization = TextCase.ALLCAPS;
            tItem_13.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_13, "Montserrat-Regular", "ArialMT");

            var col_13 = new SolidColor();
            col_13.rgb.red = 243;
            col_13.rgb.green = 233;
            col_13.rgb.blue = 227;
            tItem_13.color = col_13;
        } catch (layerErr_13) {}

        // --- TypeLayer 15: "JOHN14:26" ---
        try {
            var tLayer_14 = textGroup.artLayers.add();
            tLayer_14.kind = LayerKind.TEXT;
            tLayer_14.name = "JOHN14:26";

            var tItem_14 = tLayer_14.textItem;
            tItem_14.kind = TextType.POINTTEXT;
            tItem_14.contents = "JOHN14:26";
            tItem_14.size = 42;
            tItem_14.position = [1102, 1178];
            tItem_14.tracking = 0;
            tItem_14.capitalization = TextCase.ALLCAPS;
            tItem_14.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_14, "BebasNeue", "Impact");

            var col_14 = new SolidColor();
            col_14.rgb.red = 219;
            col_14.rgb.green = 245;
            col_14.rgb.blue = 73;
            tItem_14.color = col_14;
        } catch (layerErr_14) {}

        // --- TypeLayer 16: "HELPER" ---
        try {
            var tLayer_15 = textGroup.artLayers.add();
            tLayer_15.kind = LayerKind.TEXT;
            tLayer_15.name = "HELPER";

            var tItem_15 = tLayer_15.textItem;
            tItem_15.kind = TextType.POINTTEXT;
            tItem_15.contents = "HELPER";
            tItem_15.size = 265;
            tItem_15.position = [592, 1120];
            tItem_15.tracking = 0;
            tItem_15.capitalization = TextCase.ALLCAPS;
            tItem_15.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_15, "BebasNeue", "Impact");

            var col_15 = new SolidColor();
            col_15.rgb.red = 254;
            col_15.rgb.green = 252;
            col_15.rgb.blue = 142;
            tItem_15.color = col_15;
        } catch (layerErr_15) {}

        // --- TypeLayer 17: "HOL" ---
        try {
            var tLayer_16 = textGroup.artLayers.add();
            tLayer_16.kind = LayerKind.TEXT;
            tLayer_16.name = "HOL";

            var tItem_16 = tLayer_16.textItem;
            tItem_16.kind = TextType.POINTTEXT;
            tItem_16.contents = "HOL";
            tItem_16.size = 215;
            tItem_16.position = [210, 876];
            tItem_16.tracking = 0;
            tItem_16.capitalization = TextCase.ALLCAPS;
            tItem_16.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_16, "BebasNeue", "Impact");

            var col_16 = new SolidColor();
            col_16.rgb.red = 196;
            col_16.rgb.green = 69;
            col_16.rgb.blue = 23;
            tItem_16.color = col_16;
        } catch (layerErr_16) {}

        // --- TypeLayer 18: "SPI" ---
        try {
            var tLayer_17 = textGroup.artLayers.add();
            tLayer_17.kind = LayerKind.TEXT;
            tLayer_17.name = "SPI";

            var tItem_17 = tLayer_17.textItem;
            tItem_17.kind = TextType.POINTTEXT;
            tItem_17.contents = "SPI";
            tItem_17.size = 245;
            tItem_17.position = [661, 851];
            tItem_17.tracking = 0;
            tItem_17.capitalization = TextCase.ALLCAPS;
            tItem_17.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_17, "BebasNeue", "Impact");

            var col_17 = new SolidColor();
            col_17.rgb.red = 205;
            col_17.rgb.green = 55;
            col_17.rgb.blue = 33;
            tItem_17.color = col_17;
        } catch (layerErr_17) {}

        // --- TypeLayer 19: "FASTING & PRAYER" ---
        try {
            var tLayer_18 = textGroup.artLayers.add();
            tLayer_18.kind = LayerKind.TEXT;
            tLayer_18.name = "FASTING & PRAYER";

            var tItem_18 = tLayer_18.textItem;
            tItem_18.kind = TextType.POINTTEXT;
            tItem_18.contents = "FASTING & PRAYER";
            tItem_18.size = 17;
            tItem_18.position = [1198, 313];
            tItem_18.tracking = 60;
            tItem_18.capitalization = TextCase.ALLCAPS;
            tItem_18.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_18, "Montserrat-Regular", "ArialMT");

            var col_18 = new SolidColor();
            col_18.rgb.red = 253;
            col_18.rgb.green = 218;
            col_18.rgb.blue = 188;
            tItem_18.color = col_18;
        } catch (layerErr_18) {}

        // --- TypeLayer 20: "MARATHON" ---
        try {
            var tLayer_19 = textGroup.artLayers.add();
            tLayer_19.kind = LayerKind.TEXT;
            tLayer_19.name = "MARATHON";

            var tItem_19 = tLayer_19.textItem;
            tItem_19.kind = TextType.POINTTEXT;
            tItem_19.contents = "MARATHON";
            tItem_19.size = 14;
            tItem_19.position = [1247, 276];
            tItem_19.tracking = 60;
            tItem_19.capitalization = TextCase.ALLCAPS;
            tItem_19.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_19, "Montserrat-Bold", "Arial-BoldMT");

            var col_19 = new SolidColor();
            col_19.rgb.red = 72;
            col_19.rgb.green = 40;
            col_19.rgb.blue = 0;
            tItem_19.color = col_19;
        } catch (layerErr_19) {}

        // --- TypeLayer 21: "7DAYS" ---
        try {
            var tLayer_20 = textGroup.artLayers.add();
            tLayer_20.kind = LayerKind.TEXT;
            tLayer_20.name = "7DAYS";

            var tItem_20 = tLayer_20.textItem;
            tItem_20.kind = TextType.POINTTEXT;
            tItem_20.contents = "7DAYS";
            tItem_20.size = 17;
            tItem_20.position = [1274, 252];
            tItem_20.tracking = 60;
            tItem_20.capitalization = TextCase.ALLCAPS;
            tItem_20.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_20, "Montserrat-Regular", "ArialMT");

            var col_20 = new SolidColor();
            col_20.rgb.red = 80;
            col_20.rgb.green = 57;
            col_20.rgb.blue = 0;
            tItem_20.color = col_20;
        } catch (layerErr_20) {}

        // --- TypeLayer 22: "34TH" ---
        try {
            var tLayer_21 = textGroup.artLayers.add();
            tLayer_21.kind = LayerKind.TEXT;
            tLayer_21.name = "34TH";

            var tItem_21 = tLayer_21.textItem;
            tItem_21.kind = TextType.POINTTEXT;
            tItem_21.contents = "34TH";
            tItem_21.size = 36;
            tItem_21.position = [1232, 180];
            tItem_21.tracking = 0;
            tItem_21.capitalization = TextCase.ALLCAPS;
            tItem_21.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_21, "BebasNeue", "Impact");

            var col_21 = new SolidColor();
            col_21.rgb.red = 221;
            col_21.rgb.green = 131;
            col_21.rgb.blue = 56;
            tItem_21.color = col_21;
        } catch (layerErr_21) {}

    } finally {
        // 5. Restore User Preferences
        app.preferences.rulerUnits = origRulerUnits;
        app.preferences.typeUnits = origTypeUnits;
    }
})();
