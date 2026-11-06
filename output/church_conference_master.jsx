// ============================================================================
// Adobe Photoshop ExtendScript (.jsx) - Live TypeLayer Injector
// Target Master Artwork: church_conference_master.psd
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
            if (app.documents.length > 0 && app.activeDocument.name === "church_conference_master.psd") {
                doc = app.activeDocument;
            }
        } catch (err) {}

        if (!doc) {
            var psdFile = new File("C:/Users/QING/Desktop/Qing/cubicle/output/church_conference_master.psd");
            if (psdFile.exists) {
                doc = app.open(psdFile);
            } else {
                alert("Target PSD document not found at: C:/Users/QING/Desktop/Qing/cubicle/output/church_conference_master.psd");
                return;
            }
        }

        // 4. Create Editable Typography Group at Top of Stack
        var textGroup = doc.layerSets.add();
        textGroup.name = "Editable Typography";

        // --- TypeLayer 1: "AND YOUTUBE" ---
        try {
            var tLayer_0 = textGroup.artLayers.add();
            tLayer_0.kind = LayerKind.TEXT;
            tLayer_0.name = "AND YOUTUBE";

            var tItem_0 = tLayer_0.textItem;
            tItem_0.kind = TextType.POINTTEXT;
            tItem_0.contents = "AND YOUTUBE";
            tItem_0.size = 10;
            tItem_0.position = [575, 931];
            tItem_0.tracking = 0;
            tItem_0.capitalization = TextCase.ALLCAPS;
            tItem_0.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_0, "BebasNeue", "Impact");

            var col_0 = new SolidColor();
            col_0.rgb.red = 50;
            col_0.rgb.green = 77;
            col_0.rgb.blue = 49;
            tItem_0.color = col_0;
        } catch (layerErr_0) {}

        // --- TypeLayer 2: "RUBIKAH" ---
        try {
            var tLayer_1 = textGroup.artLayers.add();
            tLayer_1.kind = LayerKind.TEXT;
            tLayer_1.name = "RUBIKAH";

            var tItem_1 = tLayer_1.textItem;
            tItem_1.kind = TextType.POINTTEXT;
            tItem_1.contents = "RUBIKAH";
            tItem_1.size = 10;
            tItem_1.position = [504, 929];
            tItem_1.tracking = 0;
            tItem_1.capitalization = TextCase.ALLCAPS;
            tItem_1.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_1, "Montserrat-Bold", "Arial-BoldMT");

            var col_1 = new SolidColor();
            col_1.rgb.red = 39;
            col_1.rgb.green = 66;
            col_1.rgb.blue = 36;
            tItem_1.color = col_1;
        } catch (layerErr_1) {}

        // --- TypeLayer 3: "0773246551" ---
        try {
            var tLayer_2 = textGroup.artLayers.add();
            tLayer_2.kind = LayerKind.TEXT;
            tLayer_2.name = "0773246551";

            var tItem_2 = tLayer_2.textItem;
            tItem_2.kind = TextType.POINTTEXT;
            tItem_2.contents = "0773246551";
            tItem_2.size = 12;
            tItem_2.position = [139, 931];
            tItem_2.tracking = 0;
            tItem_2.capitalization = TextCase.NORMAL;
            tItem_2.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_2, "Montserrat-Black", "Arial Black");

            var col_2 = new SolidColor();
            col_2.rgb.red = 63;
            col_2.rgb.green = 125;
            col_2.rgb.blue = 57;
            tItem_2.color = col_2;
        } catch (layerErr_2) {}

        // --- TypeLayer 4: "LIVEONFACEBOOK" ---
        try {
            var tLayer_3 = textGroup.artLayers.add();
            tLayer_3.kind = LayerKind.TEXT;
            tLayer_3.name = "LIVEONFACEBOOK";

            var tItem_3 = tLayer_3.textItem;
            tItem_3.kind = TextType.POINTTEXT;
            tItem_3.contents = "LIVEONFACEBOOK";
            tItem_3.size = 10;
            tItem_3.position = [576, 918];
            tItem_3.tracking = 0;
            tItem_3.capitalization = TextCase.ALLCAPS;
            tItem_3.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_3, "BebasNeue", "Impact");

            var col_3 = new SolidColor();
            col_3.rgb.red = 39;
            col_3.rgb.green = 63;
            col_3.rgb.blue = 36;
            tItem_3.color = col_3;
        } catch (layerErr_3) {}

        // --- TypeLayer 5: "FOBINFO" ---
        try {
            var tLayer_4 = textGroup.artLayers.add();
            tLayer_4.kind = LayerKind.TEXT;
            tLayer_4.name = "FOBINFO";

            var tItem_4 = tLayer_4.textItem;
            tItem_4.kind = TextType.POINTTEXT;
            tItem_4.contents = "FOBINFO";
            tItem_4.size = 10;
            tItem_4.position = [83, 925];
            tItem_4.tracking = 0;
            tItem_4.capitalization = TextCase.ALLCAPS;
            tItem_4.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_4, "Montserrat-Bold", "Arial-BoldMT");

            var col_4 = new SolidColor();
            col_4.rgb.red = 147;
            col_4.rgb.green = 180;
            col_4.rgb.blue = 105;
            tItem_4.color = col_4;
        } catch (layerErr_4) {}

        // --- TypeLayer 6: "SEBASTIAN" ---
        try {
            var tLayer_5 = textGroup.artLayers.add();
            tLayer_5.kind = LayerKind.TEXT;
            tLayer_5.name = "SEBASTIAN";

            var tItem_5 = tLayer_5.textItem;
            tItem_5.kind = TextType.POINTTEXT;
            tItem_5.contents = "SEBASTIAN";
            tItem_5.size = 10;
            tItem_5.position = [500, 919];
            tItem_5.tracking = 0;
            tItem_5.capitalization = TextCase.ALLCAPS;
            tItem_5.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_5, "Montserrat-Bold", "Arial-BoldMT");

            var col_5 = new SolidColor();
            col_5.rgb.red = 40;
            col_5.rgb.green = 68;
            col_5.rgb.blue = 36;
            tItem_5.color = col_5;
        } catch (layerErr_5) {}

        // --- TypeLayer 7: "@OOO SEBASTIANMUBIKAH" ---
        try {
            var tLayer_6 = textGroup.artLayers.add();
            tLayer_6.kind = LayerKind.TEXT;
            tLayer_6.name = "@OOO SEBASTIANMUBIKAH";

            var tItem_6 = tLayer_6.textItem;
            tItem_6.kind = TextType.POINTTEXT;
            tItem_6.contents = "@OOO SEBASTIANMUBIKAH";
            tItem_6.size = 10;
            tItem_6.position = [260, 916];
            tItem_6.tracking = 0;
            tItem_6.capitalization = TextCase.ALLCAPS;
            tItem_6.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_6, "Montserrat-Bold", "Arial-BoldMT");

            var col_6 = new SolidColor();
            col_6.rgb.red = 71;
            col_6.rgb.green = 93;
            col_6.rgb.blue = 67;
            tItem_6.color = col_6;
        } catch (layerErr_6) {}

        // --- TypeLayer 8: "0772788819" ---
        try {
            var tLayer_7 = textGroup.artLayers.add();
            tLayer_7.kind = LayerKind.TEXT;
            tLayer_7.name = "0772788819";

            var tItem_7 = tLayer_7.textItem;
            tItem_7.kind = TextType.POINTTEXT;
            tItem_7.contents = "0772788819";
            tItem_7.size = 12;
            tItem_7.position = [139, 918];
            tItem_7.tracking = 0;
            tItem_7.capitalization = TextCase.NORMAL;
            tItem_7.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_7, "Montserrat-Black", "Arial Black");

            var col_7 = new SolidColor();
            col_7.rgb.red = 60;
            col_7.rgb.green = 125;
            col_7.rgb.blue = 54;
            tItem_7.color = col_7;
        } catch (layerErr_7) {}

        // --- TypeLayer 9: "CENTREAUDITORIUM" ---
        try {
            var tLayer_8 = textGroup.artLayers.add();
            tLayer_8.kind = LayerKind.TEXT;
            tLayer_8.name = "CENTREAUDITORIUM";

            var tItem_8 = tLayer_8.textItem;
            tItem_8.kind = TextType.POINTTEXT;
            tItem_8.contents = "CENTREAUDITORIUM";
            tItem_8.size = 11;
            tItem_8.position = [128, 880];
            tItem_8.tracking = 0;
            tItem_8.capitalization = TextCase.ALLCAPS;
            tItem_8.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_8, "Montserrat-Black", "Arial Black");

            var col_8 = new SolidColor();
            col_8.rgb.red = 33;
            col_8.rgb.green = 33;
            col_8.rgb.blue = 30;
            tItem_8.color = col_8;
        } catch (layerErr_8) {}

        // --- TypeLayer 10: "9AM-12:30PM" ---
        try {
            var tLayer_9 = textGroup.artLayers.add();
            tLayer_9.kind = LayerKind.TEXT;
            tLayer_9.name = "9AM-12:30PM";

            var tItem_9 = tLayer_9.textItem;
            tItem_9.kind = TextType.POINTTEXT;
            tItem_9.contents = "9AM-12:30PM";
            tItem_9.size = 12;
            tItem_9.position = [515, 868];
            tItem_9.tracking = 0;
            tItem_9.capitalization = TextCase.ALLCAPS;
            tItem_9.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_9, "BebasNeue", "Impact");

            var col_9 = new SolidColor();
            col_9.rgb.red = 96;
            col_9.rgb.green = 171;
            col_9.rgb.blue = 50;
            tItem_9.color = col_9;
        } catch (layerErr_9) {}

        // --- TypeLayer 11: "ADULLAM REVIVAL" ---
        try {
            var tLayer_10 = textGroup.artLayers.add();
            tLayer_10.kind = LayerKind.TEXT;
            tLayer_10.name = "ADULLAM REVIVAL";

            var tItem_10 = tLayer_10.textItem;
            tItem_10.kind = TextType.POINTTEXT;
            tItem_10.contents = "ADULLAM REVIVAL";
            tItem_10.size = 11;
            tItem_10.position = [136, 868];
            tItem_10.tracking = 0;
            tItem_10.capitalization = TextCase.ALLCAPS;
            tItem_10.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_10, "BebasNeue", "Impact");

            var col_10 = new SolidColor();
            col_10.rgb.red = 36;
            col_10.rgb.green = 35;
            col_10.rgb.blue = 32;
            tItem_10.color = col_10;
        } catch (layerErr_10) {}

        // --- TypeLayer 12: "5:30PM-8:00PM" ---
        try {
            var tLayer_11 = textGroup.artLayers.add();
            tLayer_11.kind = LayerKind.TEXT;
            tLayer_11.name = "5:30PM-8:00PM";

            var tItem_11 = tLayer_11.textItem;
            tItem_11.kind = TextType.POINTTEXT;
            tItem_11.contents = "5:30PM-8:00PM";
            tItem_11.size = 12;
            tItem_11.position = [380, 868];
            tItem_11.tracking = 0;
            tItem_11.capitalization = TextCase.ALLCAPS;
            tItem_11.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_11, "BebasNeue", "Impact");

            var col_11 = new SolidColor();
            col_11.rgb.red = 219;
            col_11.rgb.green = 241;
            col_11.rgb.blue = 214;
            tItem_11.color = col_11;
        } catch (layerErr_11) {}

        // --- TypeLayer 13: "SUNDAY SERVICE" ---
        try {
            var tLayer_12 = textGroup.artLayers.add();
            tLayer_12.kind = LayerKind.TEXT;
            tLayer_12.name = "SUNDAY SERVICE";

            var tItem_12 = tLayer_12.textItem;
            tItem_12.kind = TextType.POINTTEXT;
            tItem_12.contents = "SUNDAY SERVICE";
            tItem_12.size = 10;
            tItem_12.position = [516, 853];
            tItem_12.tracking = 0;
            tItem_12.capitalization = TextCase.ALLCAPS;
            tItem_12.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_12, "Montserrat-Black", "Arial Black");

            var col_12 = new SolidColor();
            col_12.rgb.red = 105;
            col_12.rgb.green = 165;
            col_12.rgb.blue = 72;
            tItem_12.color = col_12;
        } catch (layerErr_12) {}

        // --- TypeLayer 14: "5:80PM-8PM" ---
        try {
            var tLayer_13 = textGroup.artLayers.add();
            tLayer_13.kind = LayerKind.TEXT;
            tLayer_13.name = "5:80PM-8PM";

            var tItem_13 = tLayer_13.textItem;
            tItem_13.kind = TextType.POINTTEXT;
            tItem_13.contents = "5:80PM-8PM";
            tItem_13.size = 12;
            tItem_13.position = [278, 864];
            tItem_13.tracking = 0;
            tItem_13.capitalization = TextCase.ALLCAPS;
            tItem_13.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_13, "BebasNeue", "Impact");

            var col_13 = new SolidColor();
            col_13.rgb.red = 99;
            col_13.rgb.green = 170;
            col_13.rgb.blue = 54;
            tItem_13.color = col_13;
        } catch (layerErr_13) {}

        // --- TypeLayer 15: "EVENING SESSION" ---
        try {
            var tLayer_14 = textGroup.artLayers.add();
            tLayer_14.kind = LayerKind.TEXT;
            tLayer_14.name = "EVENING SESSION";

            var tItem_14 = tLayer_14.textItem;
            tItem_14.kind = TextType.POINTTEXT;
            tItem_14.contents = "EVENING SESSION";
            tItem_14.size = 11;
            tItem_14.position = [381, 853];
            tItem_14.tracking = 0;
            tItem_14.capitalization = TextCase.ALLCAPS;
            tItem_14.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_14, "BebasNeue", "Impact");

            var col_14 = new SolidColor();
            col_14.rgb.red = 221;
            col_14.rgb.green = 243;
            col_14.rgb.blue = 217;
            tItem_14.color = col_14;
        } catch (layerErr_14) {}

        // --- TypeLayer 16: "SESSION" ---
        try {
            var tLayer_15 = textGroup.artLayers.add();
            tLayer_15.kind = LayerKind.TEXT;
            tLayer_15.name = "SESSION";

            var tItem_15 = tLayer_15.textItem;
            tItem_15.kind = TextType.POINTTEXT;
            tItem_15.contents = "SESSION";
            tItem_15.size = 10;
            tItem_15.position = [280, 849];
            tItem_15.tracking = 0;
            tItem_15.capitalization = TextCase.ALLCAPS;
            tItem_15.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_15, "Montserrat-Black", "Arial Black");

            var col_15 = new SolidColor();
            col_15.rgb.red = 104;
            col_15.rgb.green = 165;
            col_15.rgb.blue = 69;
            tItem_15.color = col_15;
        } catch (layerErr_15) {}

        // --- TypeLayer 17: "EVENING" ---
        try {
            var tLayer_16 = textGroup.artLayers.add();
            tLayer_16.kind = LayerKind.TEXT;
            tLayer_16.name = "EVENING";

            var tItem_16 = tLayer_16.textItem;
            tItem_16.kind = TextType.POINTTEXT;
            tItem_16.contents = "EVENING";
            tItem_16.size = 12;
            tItem_16.position = [278, 837];
            tItem_16.tracking = 0;
            tItem_16.capitalization = TextCase.ALLCAPS;
            tItem_16.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_16, "BebasNeue", "Impact");

            var col_16 = new SolidColor();
            col_16.rgb.red = 100;
            col_16.rgb.green = 168;
            col_16.rgb.blue = 58;
            tItem_16.color = col_16;
        } catch (layerErr_16) {}

        // --- TypeLayer 18: "2PM-4PM" ---
        try {
            var tLayer_17 = textGroup.artLayers.add();
            tLayer_17.kind = LayerKind.TEXT;
            tLayer_17.name = "2PM-4PM";

            var tItem_17 = tLayer_17.textItem;
            tItem_17.kind = TextType.POINTTEXT;
            tItem_17.contents = "2PM-4PM";
            tItem_17.size = 15;
            tItem_17.position = [514, 801];
            tItem_17.tracking = 0;
            tItem_17.capitalization = TextCase.ALLCAPS;
            tItem_17.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_17, "BebasNeue", "Impact");

            var col_17 = new SolidColor();
            col_17.rgb.red = 63;
            col_17.rgb.green = 141;
            col_17.rgb.blue = 36;
            tItem_17.color = col_17;
        } catch (layerErr_17) {}

        // --- TypeLayer 19: "JULY 2026" ---
        try {
            var tLayer_18 = textGroup.artLayers.add();
            tLayer_18.kind = LayerKind.TEXT;
            tLayer_18.name = "JULY 2026";

            var tItem_18 = tLayer_18.textItem;
            tItem_18.kind = TextType.POINTTEXT;
            tItem_18.contents = "JULY 2026";
            tItem_18.size = 35;
            tItem_18.position = [82, 831];
            tItem_18.tracking = 0;
            tItem_18.capitalization = TextCase.ALLCAPS;
            tItem_18.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_18, "BebasNeue", "Impact");

            var col_18 = new SolidColor();
            col_18.rgb.red = 95;
            col_18.rgb.green = 175;
            col_18.rgb.blue = 44;
            tItem_18.color = col_18;
        } catch (layerErr_18) {}

        // --- TypeLayer 20: "9:00AM-12N00N" ---
        try {
            var tLayer_19 = textGroup.artLayers.add();
            tLayer_19.kind = LayerKind.TEXT;
            tLayer_19.name = "9:00AM-12N00N";

            var tItem_19 = tLayer_19.textItem;
            tItem_19.kind = TextType.POINTTEXT;
            tItem_19.contents = "9:00AM-12N00N";
            tItem_19.size = 14;
            tItem_19.position = [379, 803];
            tItem_19.tracking = 0;
            tItem_19.capitalization = TextCase.ALLCAPS;
            tItem_19.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_19, "BebasNeue", "Impact");

            var col_19 = new SolidColor();
            col_19.rgb.red = 216;
            col_19.rgb.green = 239;
            col_19.rgb.blue = 210;
            tItem_19.color = col_19;
        } catch (layerErr_19) {}

        // --- TypeLayer 21: "AFTERNOON SESSION" ---
        try {
            var tLayer_20 = textGroup.artLayers.add();
            tLayer_20.kind = LayerKind.TEXT;
            tLayer_20.name = "AFTERNOON SESSION";

            var tItem_20 = tLayer_20.textItem;
            tItem_20.kind = TextType.POINTTEXT;
            tItem_20.contents = "AFTERNOON SESSION";
            tItem_20.size = 12;
            tItem_20.position = [516, 785];
            tItem_20.tracking = 0;
            tItem_20.capitalization = TextCase.ALLCAPS;
            tItem_20.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_20, "BebasNeue", "Impact");

            var col_20 = new SolidColor();
            col_20.rgb.red = 224;
            col_20.rgb.green = 246;
            col_20.rgb.blue = 215;
            tItem_20.color = col_20;
        } catch (layerErr_20) {}

        // --- TypeLayer 22: "MORNINGSESSION" ---
        try {
            var tLayer_21 = textGroup.artLayers.add();
            tLayer_21.kind = LayerKind.TEXT;
            tLayer_21.name = "MORNINGSESSION";

            var tItem_21 = tLayer_21.textItem;
            tItem_21.kind = TextType.POINTTEXT;
            tItem_21.contents = "MORNINGSESSION";
            tItem_21.size = 12;
            tItem_21.position = [383, 785];
            tItem_21.tracking = 0;
            tItem_21.capitalization = TextCase.ALLCAPS;
            tItem_21.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_21, "BebasNeue", "Impact");

            var col_21 = new SolidColor();
            col_21.rgb.red = 216;
            col_21.rgb.green = 237;
            col_21.rgb.blue = 212;
            tItem_21.color = col_21;
        } catch (layerErr_21) {}

        // --- TypeLayer 23: "24THJULY" ---
        try {
            var tLayer_22 = textGroup.artLayers.add();
            tLayer_22.kind = LayerKind.TEXT;
            tLayer_22.name = "24THJULY";

            var tItem_22 = tLayer_22.textItem;
            tItem_22.kind = TextType.POINTTEXT;
            tItem_22.contents = "24THJULY";
            tItem_22.size = 12;
            tItem_22.position = [279, 782];
            tItem_22.tracking = 0;
            tItem_22.capitalization = TextCase.ALLCAPS;
            tItem_22.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_22, "Montserrat-Black", "Arial Black");

            var col_22 = new SolidColor();
            col_22.rgb.red = 103;
            col_22.rgb.green = 169;
            col_22.rgb.blue = 60;
            tItem_22.color = col_22;
        } catch (layerErr_22) {}

        // --- TypeLayer 24: "FRIDAY" ---
        try {
            var tLayer_23 = textGroup.artLayers.add();
            tLayer_23.kind = LayerKind.TEXT;
            tLayer_23.name = "FRIDAY";

            var tItem_23 = tLayer_23.textItem;
            tItem_23.kind = TextType.POINTTEXT;
            tItem_23.contents = "FRIDAY";
            tItem_23.size = 18;
            tItem_23.position = [277, 774];
            tItem_23.tracking = 0;
            tItem_23.capitalization = TextCase.ALLCAPS;
            tItem_23.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_23, "BebasNeue", "Impact");

            var col_23 = new SolidColor();
            col_23.rgb.red = 98;
            col_23.rgb.green = 173;
            col_23.rgb.blue = 49;
            tItem_23.color = col_23;
        } catch (layerErr_23) {}

        // --- TypeLayer 25: "SOHOOLOF" ---
        try {
            var tLayer_24 = textGroup.artLayers.add();
            tLayer_24.kind = LayerKind.TEXT;
            tLayer_24.name = "SOHOOLOF";

            var tItem_24 = tLayer_24.textItem;
            tItem_24.kind = TextType.POINTTEXT;
            tItem_24.contents = "SOHOOLOF";
            tItem_24.size = 10;
            tItem_24.position = [433, 760];
            tItem_24.tracking = 0;
            tItem_24.capitalization = TextCase.ALLCAPS;
            tItem_24.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_24, "Montserrat-Black", "Arial Black");

            var col_24 = new SolidColor();
            col_24.rgb.red = 93;
            col_24.rgb.green = 140;
            col_24.rgb.blue = 0;
            tItem_24.color = col_24;
        } catch (layerErr_24) {}

        // --- TypeLayer 26: "2426" ---
        try {
            var tLayer_25 = textGroup.artLayers.add();
            tLayer_25.kind = LayerKind.TEXT;
            tLayer_25.name = "2426";

            var tItem_25 = tLayer_25.textItem;
            tItem_25.kind = TextType.POINTTEXT;
            tItem_25.contents = "2426";
            tItem_25.size = 44;
            tItem_25.position = [82, 784];
            tItem_25.tracking = 0;
            tItem_25.capitalization = TextCase.NORMAL;
            tItem_25.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_25, "Montserrat-Black", "Arial Black");

            var col_25 = new SolidColor();
            col_25.rgb.red = 93;
            col_25.rgb.green = 176;
            col_25.rgb.blue = 42;
            tItem_25.color = col_25;
        } catch (layerErr_25) {}

        // --- TypeLayer 27: "NOKUE" ---
        try {
            var tLayer_26 = textGroup.artLayers.add();
            tLayer_26.kind = LayerKind.TEXT;
            tLayer_26.name = "NOKUE";

            var tItem_26 = tLayer_26.textItem;
            tItem_26.kind = TextType.POINTTEXT;
            tItem_26.contents = "NOKUE";
            tItem_26.size = 12;
            tItem_26.position = [412, 716];
            tItem_26.tracking = 0;
            tItem_26.capitalization = TextCase.ALLCAPS;
            tItem_26.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_26, "Montserrat-Bold", "Arial-BoldMT");

            var col_26 = new SolidColor();
            col_26.rgb.red = 31;
            col_26.rgb.green = 30;
            col_26.rgb.blue = 26;
            tItem_26.color = col_26;
        } catch (layerErr_26) {}

        // --- TypeLayer 28: "SEBASTIAN" ---
        try {
            var tLayer_27 = textGroup.artLayers.add();
            tLayer_27.kind = LayerKind.TEXT;
            tLayer_27.name = "SEBASTIAN";

            var tItem_27 = tLayer_27.textItem;
            tItem_27.kind = TextType.POINTTEXT;
            tItem_27.contents = "SEBASTIAN";
            tItem_27.size = 12;
            tItem_27.position = [260, 716];
            tItem_27.tracking = 0;
            tItem_27.capitalization = TextCase.ALLCAPS;
            tItem_27.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_27, "Montserrat-Bold", "Arial-BoldMT");

            var col_27 = new SolidColor();
            col_27.rgb.red = 34;
            col_27.rgb.green = 33;
            col_27.rgb.blue = 29;
            tItem_27.color = col_27;
        } catch (layerErr_27) {}

        // --- TypeLayer 29: "FRANCIS GUEST" ---
        try {
            var tLayer_28 = textGroup.artLayers.add();
            tLayer_28.kind = LayerKind.TEXT;
            tLayer_28.name = "FRANCIS GUEST";

            var tItem_28 = tLayer_28.textItem;
            tItem_28.kind = TextType.POINTTEXT;
            tItem_28.contents = "FRANCIS GUEST";
            tItem_28.size = 12;
            tItem_28.position = [87, 716];
            tItem_28.tracking = 0;
            tItem_28.capitalization = TextCase.ALLCAPS;
            tItem_28.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_28, "BebasNeue", "Impact");

            var col_28 = new SolidColor();
            col_28.rgb.red = 49;
            col_28.rgb.green = 56;
            col_28.rgb.blue = 46;
            tItem_28.color = col_28;
        } catch (layerErr_28) {}

        // --- TypeLayer 30: "MINISTER" ---
        try {
            var tLayer_29 = textGroup.artLayers.add();
            tLayer_29.kind = LayerKind.TEXT;
            tLayer_29.name = "MINISTER";

            var tItem_29 = tLayer_29.textItem;
            tItem_29.kind = TextType.POINTTEXT;
            tItem_29.contents = "MINISTER";
            tItem_29.size = 12;
            tItem_29.position = [564, 700];
            tItem_29.tracking = 0;
            tItem_29.capitalization = TextCase.ALLCAPS;
            tItem_29.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_29, "Montserrat-Bold", "Arial-BoldMT");

            var col_29 = new SolidColor();
            col_29.rgb.red = 27;
            col_29.rgb.green = 26;
            col_29.rgb.blue = 22;
            tItem_29.color = col_29;
        } catch (layerErr_29) {}

        // --- TypeLayer 31: "MUSICIAN RYAN MILES" ---
        try {
            var tLayer_30 = textGroup.artLayers.add();
            tLayer_30.kind = LayerKind.TEXT;
            tLayer_30.name = "MUSICIAN RYAN MILES";

            var tItem_30 = tLayer_30.textItem;
            tItem_30.kind = TextType.POINTTEXT;
            tItem_30.contents = "MUSICIAN RYAN MILES";
            tItem_30.size = 21;
            tItem_30.position = [517, 719];
            tItem_30.tracking = 0;
            tItem_30.capitalization = TextCase.ALLCAPS;
            tItem_30.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_30, "BebasNeue", "Impact");

            var col_30 = new SolidColor();
            col_30.rgb.red = 33;
            col_30.rgb.green = 41;
            col_30.rgb.blue = 29;
            tItem_30.color = col_30;
        } catch (layerErr_30) {}

        // --- TypeLayer 32: "HOST" ---
        try {
            var tLayer_31 = textGroup.artLayers.add();
            tLayer_31.kind = LayerKind.TEXT;
            tLayer_31.name = "HOST";

            var tItem_31 = tLayer_31.textItem;
            tItem_31.kind = TextType.POINTTEXT;
            tItem_31.contents = "HOST";
            tItem_31.size = 10;
            tItem_31.position = [228, 707];
            tItem_31.tracking = 0;
            tItem_31.capitalization = TextCase.ALLCAPS;
            tItem_31.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_31, "BebasNeue", "Impact");

            var col_31 = new SolidColor();
            col_31.rgb.red = 47;
            col_31.rgb.green = 91;
            col_31.rgb.blue = 48;
            tItem_31.color = col_31;
        } catch (layerErr_31) {}

        // --- TypeLayer 33: "GUEST" ---
        try {
            var tLayer_32 = textGroup.artLayers.add();
            tLayer_32.kind = LayerKind.TEXT;
            tLayer_32.name = "GUEST";

            var tItem_32 = tLayer_32.textItem;
            tItem_32.kind = TextType.POINTTEXT;
            tItem_32.contents = "GUEST";
            tItem_32.size = 10;
            tItem_32.position = [522, 701];
            tItem_32.tracking = 0;
            tItem_32.capitalization = TextCase.ALLCAPS;
            tItem_32.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_32, "Montserrat-Bold", "Arial-BoldMT");

            var col_32 = new SolidColor();
            col_32.rgb.red = 53;
            col_32.rgb.green = 95;
            col_32.rgb.blue = 49;
            tItem_32.color = col_32;
        } catch (layerErr_32) {}

        // --- TypeLayer 34: "APOSTLE" ---
        try {
            var tLayer_33 = textGroup.artLayers.add();
            tLayer_33.kind = LayerKind.TEXT;
            tLayer_33.name = "APOSTLE";

            var tItem_33 = tLayer_33.textItem;
            tItem_33.kind = TextType.POINTTEXT;
            tItem_33.contents = "APOSTLE";
            tItem_33.size = 12;
            tItem_33.position = [260, 701];
            tItem_33.tracking = 0;
            tItem_33.capitalization = TextCase.ALLCAPS;
            tItem_33.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_33, "Montserrat-Bold", "Arial-BoldMT");

            var col_33 = new SolidColor();
            col_33.rgb.red = 32;
            col_33.rgb.green = 31;
            col_33.rgb.blue = 27;
            tItem_33.color = col_33;
        } catch (layerErr_33) {}

        // --- TypeLayer 35: "PROPHETSTEVEN" ---
        try {
            var tLayer_34 = textGroup.artLayers.add();
            tLayer_34.kind = LayerKind.TEXT;
            tLayer_34.name = "PROPHETSTEVEN";

            var tItem_34 = tLayer_34.textItem;
            tItem_34.kind = TextType.POINTTEXT;
            tItem_34.contents = "PROPHETSTEVEN";
            tItem_34.size = 12;
            tItem_34.position = [89, 701];
            tItem_34.tracking = 0;
            tItem_34.capitalization = TextCase.ALLCAPS;
            tItem_34.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_34, "Montserrat-Bold", "Arial-BoldMT");

            var col_34 = new SolidColor();
            col_34.rgb.red = 41;
            col_34.rgb.green = 41;
            col_34.rgb.blue = 38;
            tItem_34.color = col_34;
        } catch (layerErr_34) {}

        // --- TypeLayer 36: "PASTOR" ---
        try {
            var tLayer_35 = textGroup.artLayers.add();
            tLayer_35.kind = LayerKind.TEXT;
            tLayer_35.name = "PASTOR";

            var tItem_35 = tLayer_35.textItem;
            tItem_35.kind = TextType.POINTTEXT;
            tItem_35.contents = "PASTOR";
            tItem_35.size = 14;
            tItem_35.position = [412, 701];
            tItem_35.tracking = 0;
            tItem_35.capitalization = TextCase.ALLCAPS;
            tItem_35.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_35, "Montserrat-Bold", "Arial-BoldMT");

            var col_35 = new SolidColor();
            col_35.rgb.red = 42;
            col_35.rgb.green = 41;
            col_35.rgb.blue = 38;
            tItem_35.color = col_35;
        } catch (layerErr_35) {}

        // --- TypeLayer 37: "PROPHETIC CONFERENCE" ---
        try {
            var tLayer_36 = textGroup.artLayers.add();
            tLayer_36.kind = LayerKind.TEXT;
            tLayer_36.name = "PROPHETIC CONFERENCE";

            var tItem_36 = tLayer_36.textItem;
            tItem_36.kind = TextType.POINTTEXT;
            tItem_36.contents = "PROPHETIC CONFERENCE";
            tItem_36.size = 35;
            tItem_36.position = [83, 288];
            tItem_36.tracking = 0;
            tItem_36.capitalization = TextCase.ALLCAPS;
            tItem_36.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_36, "Montserrat-Black", "Arial Black");

            var col_36 = new SolidColor();
            col_36.rgb.red = 200;
            col_36.rgb.green = 70;
            col_36.rgb.blue = 29;
            tItem_36.color = col_36;
        } catch (layerErr_36) {}

        // --- TypeLayer 38: "PREPARE" ---
        try {
            var tLayer_37 = textGroup.artLayers.add();
            tLayer_37.kind = LayerKind.TEXT;
            tLayer_37.name = "PREPARE";

            var tItem_37 = tLayer_37.textItem;
            tItem_37.kind = TextType.POINTTEXT;
            tItem_37.contents = "PREPARE";
            tItem_37.size = 117;
            tItem_37.position = [77, 215];
            tItem_37.tracking = 0;
            tItem_37.capitalization = TextCase.ALLCAPS;
            tItem_37.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_37, "Montserrat-Black", "Arial Black");

            var col_37 = new SolidColor();
            col_37.rgb.red = 86;
            col_37.rgb.green = 175;
            col_37.rgb.blue = 30;
            tItem_37.color = col_37;
        } catch (layerErr_37) {}

        // --- TypeLayer 39: "PRESENTS" ---
        try {
            var tLayer_38 = textGroup.artLayers.add();
            tLayer_38.kind = LayerKind.TEXT;
            tLayer_38.name = "PRESENTS";

            var tItem_38 = tLayer_38.textItem;
            tItem_38.kind = TextType.POINTTEXT;
            tItem_38.contents = "PRESENTS";
            tItem_38.size = 15;
            tItem_38.position = [470, 67];
            tItem_38.tracking = 0;
            tItem_38.capitalization = TextCase.ALLCAPS;
            tItem_38.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_38, "Montserrat-Regular", "ArialMT");

            var col_38 = new SolidColor();
            col_38.rgb.red = 53;
            col_38.rgb.green = 114;
            col_38.rgb.blue = 54;
            tItem_38.color = col_38;
        } catch (layerErr_38) {}

        // --- TypeLayer 40: "ADULLAM REVIVAL CENTRE" ---
        try {
            var tLayer_39 = textGroup.artLayers.add();
            tLayer_39.kind = LayerKind.TEXT;
            tLayer_39.name = "ADULLAM REVIVAL CENTRE";

            var tItem_39 = tLayer_39.textItem;
            tItem_39.kind = TextType.POINTTEXT;
            tItem_39.contents = "ADULLAM REVIVAL CENTRE";
            tItem_39.size = 18;
            tItem_39.position = [205, 63];
            tItem_39.tracking = 0;
            tItem_39.capitalization = TextCase.ALLCAPS;
            tItem_39.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_39, "Montserrat-Black", "Arial Black");

            var col_39 = new SolidColor();
            col_39.rgb.red = 29;
            col_39.rgb.green = 28;
            col_39.rgb.blue = 26;
            tItem_39.color = col_39;
        } catch (layerErr_39) {}

    } finally {
        // 5. Restore User Preferences
        app.preferences.rulerUnits = origRulerUnits;
        app.preferences.typeUnits = origTypeUnits;
    }
})();
