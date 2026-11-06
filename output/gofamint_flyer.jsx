// ============================================================================
// Adobe Photoshop ExtendScript (.jsx) - Live TypeLayer Injector
// Target Master Artwork: gofamint_flyer.psd
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
            if (app.documents.length > 0 && app.activeDocument.name === "gofamint_flyer.psd") {
                doc = app.activeDocument;
            }
        } catch (err) {}

        if (!doc) {
            var psdFile = new File("C:/Users/QING/Desktop/Qing/cubicle/output/gofamint_flyer.psd");
            if (psdFile.exists) {
                doc = app.open(psdFile);
            } else {
                alert("Target PSD document not found at: C:/Users/QING/Desktop/Qing/cubicle/output/gofamint_flyer.psd");
                return;
            }
        }

        // 4. Create Editable Typography Group at Top of Stack
        var textGroup = doc.layerSets.add();
        textGroup.name = "Editable Typography";

        // --- TypeLayer 1: "NONEOMTMGMNTU" ---
        try {
            var tLayer_0 = textGroup.artLayers.add();
            tLayer_0.kind = LayerKind.TEXT;
            tLayer_0.name = "NONEOMTMGMNTU";

            var tItem_0 = tLayer_0.textItem;
            tItem_0.kind = TextType.POINTTEXT;
            tItem_0.contents = "NONEOMTMGMNTU";
            tItem_0.size = 10;
            tItem_0.position = [86, 279];
            tItem_0.tracking = 60;
            tItem_0.capitalization = TextCase.ALLCAPS;
            tItem_0.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_0, "Montserrat-Bold", "Arial-BoldMT");

            var col_0 = new SolidColor();
            col_0.rgb.red = 171;
            col_0.rgb.green = 167;
            col_0.rgb.blue = 166;
            tItem_0.color = col_0;
        } catch (layerErr_0) {}

        // --- TypeLayer 2: "Whheatoreeoosrdpeeesf" ---
        try {
            var tLayer_1 = textGroup.artLayers.add();
            tLayer_1.kind = LayerKind.TEXT;
            tLayer_1.name = "Whheatoreeoosrdpeeesf";

            var tItem_1 = tLayer_1.textItem;
            tItem_1.kind = TextType.POINTTEXT;
            tItem_1.contents = "Whheatoreeoosrdpeeesf";
            tItem_1.size = 10;
            tItem_1.position = [71, 265];
            tItem_1.tracking = 0;
            tItem_1.capitalization = TextCase.NORMAL;
            tItem_1.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_1, "Montserrat-Bold", "Arial-BoldMT");

            var col_1 = new SolidColor();
            col_1.rgb.red = 168;
            col_1.rgb.green = 167;
            col_1.rgb.blue = 167;
            tItem_1.color = col_1;
        } catch (layerErr_1) {}

        // --- TypeLayer 3: "Pst.(Dr.)LawrenceWaleOlani" ---
        try {
            var tLayer_2 = textGroup.artLayers.add();
            tLayer_2.kind = LayerKind.TEXT;
            tLayer_2.name = "Pst.(Dr.)LawrenceWaleOlani";

            var tItem_2 = tLayer_2.textItem;
            tItem_2.kind = TextType.POINTTEXT;
            tItem_2.contents = "Pst.(Dr.)LawrenceWaleOlaniy";
            tItem_2.size = 10;
            tItem_2.position = [68, 273];
            tItem_2.tracking = 0;
            tItem_2.capitalization = TextCase.NORMAL;
            tItem_2.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_2, "Montserrat-Bold", "Arial-BoldMT");

            var col_2 = new SolidColor();
            col_2.rgb.red = 97;
            col_2.rgb.green = 95;
            col_2.rgb.blue = 96;
            tItem_2.color = col_2;
        } catch (layerErr_2) {}

        // --- TypeLayer 4: "ODEYEMI" ---
        try {
            var tLayer_3 = textGroup.artLayers.add();
            tLayer_3.kind = LayerKind.TEXT;
            tLayer_3.name = "ODEYEMI";

            var tItem_3 = tLayer_3.textItem;
            tItem_3.kind = TextType.POINTTEXT;
            tItem_3.contents = "ODEYEMI";
            tItem_3.size = 10;
            tItem_3.position = [30, 206];
            tItem_3.tracking = 60;
            tItem_3.capitalization = TextCase.ALLCAPS;
            tItem_3.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_3, "Montserrat-Black", "Arial Black");

            var col_3 = new SolidColor();
            col_3.rgb.red = 12;
            col_3.rgb.green = 12;
            col_3.rgb.blue = 10;
            tItem_3.color = col_3;
        } catch (layerErr_3) {}

        // --- TypeLayer 5: "FEMI" ---
        try {
            var tLayer_4 = textGroup.artLayers.add();
            tLayer_4.kind = LayerKind.TEXT;
            tLayer_4.name = "FEMI";

            var tItem_4 = tLayer_4.textItem;
            tItem_4.kind = TextType.POINTTEXT;
            tItem_4.contents = "FEMI";
            tItem_4.size = 10;
            tItem_4.position = [29, 196];
            tItem_4.tracking = 0;
            tItem_4.capitalization = TextCase.ALLCAPS;
            tItem_4.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_4, "Montserrat-Bold", "Arial-BoldMT");

            var col_4 = new SolidColor();
            col_4.rgb.red = 10;
            col_4.rgb.green = 10;
            col_4.rgb.blue = 8;
            tItem_4.color = col_4;
        } catch (layerErr_4) {}

        // --- TypeLayer 6: "BARR." ---
        try {
            var tLayer_5 = textGroup.artLayers.add();
            tLayer_5.kind = LayerKind.TEXT;
            tLayer_5.name = "BARR.";

            var tItem_5 = tLayer_5.textItem;
            tItem_5.kind = TextType.POINTTEXT;
            tItem_5.contents = "BARR.";
            tItem_5.size = 10;
            tItem_5.position = [29, 187];
            tItem_5.tracking = 0;
            tItem_5.capitalization = TextCase.ALLCAPS;
            tItem_5.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_5, "Montserrat-Bold", "Arial-BoldMT");

            var col_5 = new SolidColor();
            col_5.rgb.red = 19;
            col_5.rgb.green = 19;
            col_5.rgb.blue = 17;
            tItem_5.color = col_5;
        } catch (layerErr_5) {}

        // --- TypeLayer 7: "GOFAMINTWORLDWIDE" ---
        try {
            var tLayer_6 = textGroup.artLayers.add();
            tLayer_6.kind = LayerKind.TEXT;
            tLayer_6.name = "GOFAMINTWORLDWIDE";

            var tItem_6 = tLayer_6.textItem;
            tItem_6.kind = TextType.POINTTEXT;
            tItem_6.contents = "GOFAMINTWORLDWIDE";
            tItem_6.size = 10;
            tItem_6.position = [41, 129];
            tItem_6.tracking = 60;
            tItem_6.capitalization = TextCase.ALLCAPS;
            tItem_6.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_6, "Montserrat-Regular", "ArialMT");

            var col_6 = new SolidColor();
            col_6.rgb.red = 40;
            col_6.rgb.green = 41;
            col_6.rgb.blue = 39;
            tItem_6.color = col_6;
        } catch (layerErr_6) {}

        // --- TypeLayer 8: "GENERALSECRETARY" ---
        try {
            var tLayer_7 = textGroup.artLayers.add();
            tLayer_7.kind = LayerKind.TEXT;
            tLayer_7.name = "GENERALSECRETARY";

            var tItem_7 = tLayer_7.textItem;
            tItem_7.kind = TextType.POINTTEXT;
            tItem_7.contents = "GENERALSECRETARY";
            tItem_7.size = 10;
            tItem_7.position = [37, 116];
            tItem_7.tracking = 60;
            tItem_7.capitalization = TextCase.ALLCAPS;
            tItem_7.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_7, "Montserrat-Black", "Arial Black");

            var col_7 = new SolidColor();
            col_7.rgb.red = 196;
            col_7.rgb.green = 152;
            col_7.rgb.blue = 40;
            tItem_7.color = col_7;
        } catch (layerErr_7) {}

        // --- TypeLayer 9: "ONTOURAPPOINTMENI" ---
        try {
            var tLayer_8 = textGroup.artLayers.add();
            tLayer_8.kind = LayerKind.TEXT;
            tLayer_8.name = "ONTOURAPPOINTMENI";

            var tItem_8 = tLayer_8.textItem;
            tItem_8.kind = TextType.POINTTEXT;
            tItem_8.contents = "ONTOURAPPOINTMENI";
            tItem_8.size = 10;
            tItem_8.position = [64, 101];
            tItem_8.tracking = 60;
            tItem_8.capitalization = TextCase.ALLCAPS;
            tItem_8.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_8, "Montserrat-Regular", "ArialMT");

            var col_8 = new SolidColor();
            col_8.rgb.red = 156;
            col_8.rgb.green = 155;
            col_8.rgb.blue = 153;
            tItem_8.color = col_8;
        } catch (layerErr_8) {}

        // --- TypeLayer 10: "UNITEOKINGDOM" ---
        try {
            var tLayer_9 = textGroup.artLayers.add();
            tLayer_9.kind = LayerKind.TEXT;
            tLayer_9.name = "UNITEOKINGDOM";

            var tItem_9 = tLayer_9.textItem;
            tItem_9.kind = TextType.POINTTEXT;
            tItem_9.contents = "UNITEOKINGDOM";
            tItem_9.size = 10;
            tItem_9.position = [77, 63];
            tItem_9.tracking = 60;
            tItem_9.capitalization = TextCase.ALLCAPS;
            tItem_9.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_9, "Montserrat-Regular", "ArialMT");

            var col_9 = new SolidColor();
            col_9.rgb.red = 147;
            col_9.rgb.green = 147;
            col_9.rgb.blue = 144;
            tItem_9.color = col_9;
        } catch (layerErr_9) {}

        // --- TypeLayer 11: "CCONGRATULATIONS" ---
        try {
            var tLayer_10 = textGroup.artLayers.add();
            tLayer_10.kind = LayerKind.TEXT;
            tLayer_10.name = "CCONGRATULATIONS";

            var tItem_10 = tLayer_10.textItem;
            tItem_10.kind = TextType.POINTTEXT;
            tItem_10.contents = "CCONGRATULATIONS";
            tItem_10.size = 28;
            tItem_10.position = [11, 97];
            tItem_10.tracking = 0;
            tItem_10.capitalization = TextCase.ALLCAPS;
            tItem_10.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_10, "BebasNeue", "Impact");

            var col_10 = new SolidColor();
            col_10.rgb.red = 166;
            col_10.rgb.green = 65;
            col_10.rgb.blue = 89;
            tItem_10.color = col_10;
        } catch (layerErr_10) {}

        // --- TypeLayer 12: "THEGOSPELFAITHMISSIONINTER" ---
        try {
            var tLayer_11 = textGroup.artLayers.add();
            tLayer_11.kind = LayerKind.TEXT;
            tLayer_11.name = "THEGOSPELFAITHMISSIONINTER";

            var tItem_11 = tLayer_11.textItem;
            tItem_11.kind = TextType.POINTTEXT;
            tItem_11.contents = "THEGOSPELFAITHMISSIONINTERNATIONAL";
            tItem_11.size = 10;
            tItem_11.position = [48, 55];
            tItem_11.tracking = 0;
            tItem_11.capitalization = TextCase.ALLCAPS;
            tItem_11.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_11, "Montserrat-Black", "Arial Black");

            var col_11 = new SolidColor();
            col_11.rgb.red = 77;
            col_11.rgb.green = 76;
            col_11.rgb.blue = 71;
            tItem_11.color = col_11;
        } catch (layerErr_11) {}

    } finally {
        // 5. Restore User Preferences
        app.preferences.rulerUnits = origRulerUnits;
        app.preferences.typeUnits = origTypeUnits;
    }
})();
