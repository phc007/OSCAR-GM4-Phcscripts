// ==UserScript==
// @name     Preventions PHC
// @version  1.2.2
// @grant    none
// @namespace Phcscript
// @include *oscar/oscarPrevention/index.jsp*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js    
// ==/UserScript==

jQuery.noConflict();

//=====Get Parameters============
var params = {};
if (location.search) {
    var parts = location.search.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
    }
}
console.log(params);

(function() {
	'use strict';

	const css = `
    .ui-menu {
         list-style:none;
         padding:2px;
         margin:0;
         display:block;
         outline:0 
    }
     .ui-menu .ui-menu {
         margin-top:-3px;
         position:absolute 
    }
     .ui-menu .ui-menu-item {
         margin:0;
         padding:0;
         width:100%;
         background-color:white 
    }
	`;

	const styleElement = document.createElement('style');
	styleElement.textContent = css;
	document.head.appendChild(styleElement);
})();

//========Input============
var input1=document.createElement("input");
input1.type="text";
input1.setAttribute("style", "position: absolute; left: 380px; top: 10px; width: 300px; font-size:12px; padding: 2px; margin-right: 3px;");
input1.setAttribute("id","immunization");
input1.setAttribute("placeholder","pick brand");
document.body.appendChild(input1);

var tags = [
{name:"OtherA", value:"IXCHIQ not less than 3.0 log10 TCID50 per 0.5 milliliter powder for solution for injection", manufacture:"Valneva Austria GmbH", dose:"0.5", units:"mL", route:"IM", din:"2548984"},
{name:"Chol-Ecol-O", value:"DUKORAL oral suspension", manufacture:"Valneva Sweden AB", dose:"", units:"DOSE", route:"PO", din:"2247208"},
{name:"CHOLERA", value:"VAXCHORA 400000000 to 2000000000 colony forming units per sachet powder for oral suspension", manufacture:"Bavarian Nordic AS", dose:"", units:"DOSE", route:"PO", din:"2538164"},
{name:"OtherA", value:"Cytogam 50 milligrams per milliliter solution for infusion", manufacture:"KI BioPharma LLC", dose:"50", units:"mL", route:"IV", din:"2231962"},
{name:"OtherA", value:"Cytogam 50 milligrams per milliliter solution for infusion", manufacture:"Saol Therapeutics Research Limited", dose:"50", units:"mL", route:"IV", din:"2231962"},
{name:"Covid19+mRNA+Vaccine", value:"COMIRNATY messenger ribonucleic acid 10 micrograms per 0.3 milliliter suspension for injection", manufacture:"BioNTech Manufacturing GmbH", dose:"0.3", units:"mL", route:"IM", din:"2541858"},
{name:"Covid19+mRNA+Vaccine", value:"COMIRNATY messenger ribonucleic acid 30 micrograms per 0.3 milliliter suspension for injection", manufacture:"BioNTech Manufacturing GmbH", dose:"0.3", units:"mL", route:"IM", din:"2552035"},
{name:"Covid19+mRNA+Vaccine", value:"COMIRNATY Omicron XBB.1.5 messenger ribonucleic acid 10 micrograms per 0.3 milliliter suspension for injection", manufacture:"BioNTech Manufacturing GmbH", dose:"0.3", units:"mL", route:"IM", din:"2541858"},
{name:"Covid19+mRNA+Vaccine", value:"COMIRNATY Omicron XBB.1.5 messenger ribonucleic acid 30 micrograms per 0.3 milliliter suspension for injection", manufacture:"BioNTech Manufacturing GmbH", dose:"0.3", units:"mL", route:"IM", din:"2541823"},
{name:"Covid19+mRNA+Vaccine", value:"SPIKEVAX messenger ribonucleic acid 0.10 milligrams per 1 milliliter dispersion for injection", manufacture:"Moderna Biopharma Canada Corporation", dose:"", units:"mL", route:"IM", din:"2541270"},
{name:"Covid19+mRNA+Vaccine", value:"SPIKEVAX XBB.1.5 messenger ribonucleic acid 0.10 milligrams per 1 milliliter dispersion for injection", manufacture:"Moderna Biopharma Canada Corporation", dose:"", units:"mL", route:"IM", din:"2541270"},
{name:"DTaP-HBV-IPV-Hib", value:"INFANRIX hexa suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2253852"},
{name:"HepA", value:"AVAXIM 160 units per 0.5 milliliter suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2237792"},
{name:"HepA", value:"Havrix 1440 ELISA units per milliliter suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"", units:"mL", route:"IM", din:"2187078"},
{name:"HepA", value:"Havrix 720 ELISA units per 0.5 milliliter suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2231056"},
{name:"HepA", value:"VAQTA 25 units per 0.5 milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"", units:"mL", route:"IM", din:"2229702"},
{name:"HepA", value:"VAQTA 50 units per milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"", units:"mL", route:"IM", din:"2229702"},
{name:"HepAB", value:"Twinrix 360 ELISA units HAV and 10 micrograms HBV per 0.5 milliliter suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2237548"},
{name:"HepAB", value:"Twinrix 720 ELISA units HAV and 20 micrograms HBV per milliliter suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"1", units:"mL", route:"IM", din:"2230578"},
{name:"HB", value:"RECOMBIVAX HB 10 micrograms per milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"", units:"mL", route:"IM", din:"2243676"},
{name:"HB", value:"RECOMBIVAX HB 40 micrograms per milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"", units:"mL", route:"IM", din:"2245977"},
{name:"HB", value:"RECOMBIVAX HB 5 micrograms per 0.5 milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"", units:"mL", route:"IM", din:"2243676"},
{name:"OtherA", value:"HepaGam B 312 international units per milliliter liquid for injection", manufacture:"KI BioPharma LLC", dose:"", units:"mL", route:"IM", din:"2290979"},
{name:"OtherA", value:"HepaGam B 312 international units per milliliter liquid for injection", manufacture:"Saol Therapeutic Research Limited", dose:"", units:"mL", route:"IM", din:"2290979"},
{name:"OtherA", value:"HyperHEP B 110 international units per 0.5 milliliter solution for injection", manufacture:"Grifols Therapeutics Inc.", dose:"0.5", units:"mL", route:"IM", din:"2520125"},
{name:"OtherA", value:"HyperHEP B 220 international units per milliliter solution for injection", manufacture:"Grifols Therapeutics Inc.", dose:"", units:"mL", route:"IM", din:"2520001"},
{name:"Hib", value:"Act-HIB 10 micrograms per 0.5 milliliter powder and diluent for solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"1959034"},
{name:"HPV+Vaccine", value:"CERVARIX 40 micrograms per 0.5 milliliter suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2342227"},
{name:"HPV+Vaccine+9", value:"GARDASIL 9 270 micrograms per 0.5 milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"mL", route:"IM", din:"2437058"},
{name:"OtherA", value:"GamaSTAN 15 to 18 percent solution for injection", manufacture:"Grifols Therapeutics Inc.", dose:"", units:"", route:"IM", din:"2486598"},
{name:"Flu", value:"AREPANRIX H5N1 3.75 micrograms per 0.5 milliliter suspension and emulsion for injection", manufacture:"ID Biomedical Corporation of Quebec", dose:"0.5", units:"mL", route:"IM", din:"2401886"},
{name:"Flu", value:"FLUAD 15 micrograms per 0.5 milliliter suspension for injection", manufacture:"Seqirus UK Limited", dose:"0.5", units:"mL", route:"IM", din:"2362384"},
{name:"Flu", value:"FLULAVAL TETRA 15 micrograms per 0.5 milliliter suspension for injection", manufacture:"ID Biomedical Corporation of Quebec", dose:"0.5", units:"mL", route:"IM", din:"2420783"},
{name:"Flu", value:"FLUMIST QUADRIVALENT 0.2 milliliter intranasal spray", manufacture:"AstraZeneca Canada Inc.", dose:"0.2", units:"mL", route:"Intranasal", din:"2426544"},
{name:"Flu", value:"FLUZONE High-Dose Quadrivalent 60 micrograms per 0.7 milliliter suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.7", units:"mL", route:"IM", din:"2500523"},
{name:"Flu", value:"FLUZONE Quadrivalent 15 micrograms per 0.5 milliliter suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2432730"},
{name:"Flu", value:"INFLUVAC TETRA 15 micrograms per 0.5 milliliter suspension for injection", manufacture:"BGP Pharma ULC", dose:"0.5", units:"mL", route:"IM", din:"2484854"},
{name:"IPV", value:"IMOVAX Polio 80 units per 0.5 milliliter solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"SQ", din:"1959042"},
{name:"JE", value:"IXIARO 6 micrograms per 0.5 milliliter suspension for injection", manufacture:"Valneva Austria GmbH", dose:"0.5", units:"mL", route:"IM", din:"2333279"},
{name:"rMenB", value:"BEXSERO suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2417030"},
{name:"rMenB", value:"Trumenba suspension for injection", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2468751"},
{name:"MenC-C", value:"MenQuadfi solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2507161"},
{name:"Men-C-ACYW-135", value:"Menactra solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2279924"},
{name:"Men-C-ACYW-135", value:"Menveo powder and solution for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2347393"},
{name:"Men-C-ACYW-135", value:"NIMENRIX powder and diluent for solution for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2402904"},
{name:"Men-C-ACYW-135", value:"NIMENRIX powder and diluent for solution for injection", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2402904"},
{name:"MenC-C", value:"MENJUGATE Liquid 10 micrograms suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2440709"},
{name:"MenC-C", value:"NeisVac-C 10 micrograms per 0.5 milliliter suspension for injection", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2245057"},
{name:"MMR", value:"M-M-R II powder and diluent for solution for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"mL", route:"", din:"466085"},
{name:"MMR", value:"PRIORIX powder and diluent for solution for injection", manufacture:"GlaxoSmithKline Inc.", dose:"", units:"", route:"", din:"2239208"},
{name:"MMRV", value:"PRIORIX-TETRA powder and solution for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"", din:"2297884"},
{name:"MMRV", value:"ProQuad powder and diluent for solution for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"", route:"SQ", din:"2399229"},
{name:"Prevnar+13", value:"Prevnar 13 suspension for injection", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2335204"},
{name:"Pneu-C-15", value:"VAXNEUVANCE 0.5 milliliter suspension for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"mL", route:"IM", din:"2522403"},
{name:"Prevnar+20", value:"PREVNAR 20 0.5 milliliter suspension for injection", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2527049"},
{name:"Prevnar+21", value:"CAPVAXIVE 0.5 milliliter solution for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"mL", route:"IM", din:"2549891"},
{name:"Rabies", value:"Imovax Rabies 2.5 international units per milliliter powder for solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"", units:"VIAL", route:"IM", din:"1908286"},
{name:"Rabies", value:"RABAVERT 2.5 international units per milliliter powder for solution for injection", manufacture:"Bavarian Nordic AS", dose:"", units:"DOSE", route:"IM", din:"2267667"},
{name:"OtherA", value:"HyperRAB 300 international units per milliliter solution for injection", manufacture:"Grifols Therapeutics Inc.", dose:"", units:"mL", route:"IM", din:"2486571"},
{name:"OtherA", value:"KamRAB 150 international units per milliliter solution for injection", manufacture:"Kamada Ltd", dose:"", units:"mL", route:"IM", din:"2482436"},
{name:"Rot", value:"ROTARIX 1000000 units per 1.5 milliliter oral suspension", manufacture:"GlaxoSmithKline Inc.", dose:"1.5", units:"mL", route:"PO", din:"2300591"},
{name:"Rot", value:"RotaTeq 115000000 units per 2 milliliter oral solution", manufacture:"Merck Canada Inc.", dose:"", units:"DOSE", route:"PO", din:"2284413"},
{name:"RSV+Vaccine", value:"ABRYSVO 120 micrograms per 0.5 milliliter powder for suspension", manufacture:"Pfizer Canada ULC", dose:"0.5", units:"mL", route:"IM", din:"2544040"},
{name:"RSV+Vaccine", value:"AREXVY 120 micrograms per 0.5 milliliter powder and suspension for suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2540207"},
{name:"RSV+Vaccine", value:"BEYFORTUS 100 milligrams per 1 milliliter solution for injection syringe", manufacture:"Sanofi Pasteur Limited", dose:"1", units:"mL", route:"IM", din:"2537214"},
{name:"RSV+Vaccine", value:"BEYFORTUS 50 milligrams per 0.5 milliliter solution for injection syringe", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2537206"},
{name:"RSV+Vaccine", value:"SYNAGIS 100 milligrams per milliliter powder for solution for injection", manufacture:"Boehringer Ingelheim (BI) Pharma KG", dose:"", units:"mL", route:"IM", din:"2438364"},
{name:"RSV+Vaccine", value:"SYNAGIS 100 milligrams per milliliter solution for injection", manufacture:"AstraZeneca Canada Inc.", dose:"", units:"mL", route:"IM", din:"2438364"},
{name:"Shingrix", value:"SHINGRIX 50 micrograms per 0.5 milliliter powder and suspension for suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2468425"},
{name:"Td", value:"Td ADSORBED 5 limit of flocculation units and 2 limit of flocculation units per 0.5 milliliter without preservative suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2528401"},
{name:"Tdap", value:"ADACEL suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2240255"},
{name:"Tdap", value:"BOOSTRIX suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2247600"},
{name:"Tdap-IPV", value:"ADACEL-POLIO suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2352044"},
{name:"Tdap-IPV", value:"BOOSTRIX-POLIO suspension for injection", manufacture:"GlaxoSmithKline Inc.", dose:"0.5", units:"mL", route:"IM", din:"2312557"},
{name:"OtherA", value:"HyperTET 250 antitoxin units per milliliter solution for injection", manufacture:"Grifols Therapeutics Inc.", dose:"", units:"mL", route:"IM", din:"2520087"},
{name:"Typhoid-I", value:"TYPHIM Vi 25 micrograms per 0.5 milliliter solution for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"IM", din:"2130955"},
{name:"Typh-O", value:"Vivotif 10 billion units enteric coated capsule", manufacture:"Bavarian Nordic AS", dose:"", units:"", route:"PO", din:"885975"},
{name:"Varicella", value:"VARILRIX not less than 1995 plaque forming units per 0.5 milliliter powder and diluent for solution for injection", manufacture:"GlaxoSmithKline Inc.", dose:"", units:"", route:"SQ", din:"2241047"},
{name:"Varicella", value:"VARIVAX III 1350 plaque forming units powder and diluent for solution for injection", manufacture:"Merck Canada Inc.", dose:"0.5", units:"mL", route:"SQ", din:"2246081"},
{name:"OtherA", value:"VariZIG 125 international units per 1.2 milliliter solution for injection", manufacture:"KI BioPharma LLC", dose:"", units:"VIAL", route:"IM", din:"2442183"},
{name:"OtherA", value:"VariZIG 125 international units per 1.2 milliliter solution for injection", manufacture:"Saol Therapeutics Research Limited", dose:"", units:"VIAL", route:"IM", din:"2442183"},
{name:"YF", value:"YF-VAX 109648 plaque forming units per 0.5 milliliter powder and diluent for suspension for injection", manufacture:"Sanofi Pasteur Limited", dose:"0.5", units:"mL", route:"SQ", din:"428833"},
{name:"Tuberculosis", value:"Tubersol", manufacture:"Sanofi Pasteur Limited", dose:"0.1", units:"mL", route:"Intradermal", din:"428833"}
  ];

function onViewPrevention(url, preventionSelected) {
	iframe = document.querySelector('iframe#prevention-preview');
	if (!iframe) {
		return;
	}
	jQuery('.prevention-result-item-inner').removeClass('active');
	if (document.previewUrl != url) {
		document.previewUrl = url;
		iframe.src = url;
		iframe.classList.remove('d-none');
		jQuery('.section-right').addClass('active');
		jQuery('#preview-backdrop').removeClass('d-none');
		if (preventionSelected) {
			jQuery(preventionSelected).addClass('active');
		}
	}
}

jQuery(document).ready(function() {
  
  	if (params.prevention){
      console.log("parameter "+params.prevention);
    		onViewPrevention('AddPreventionData.jsp?prevention='+params.prevention+'&demographic_no='+params.demographic_no+'&prevResultDesc=', null);  
    }

    jQuery("#immunization").autocomplete({  source: tags,  select: function(event, ui) {
			// ui.item will contain the selected object from the source
      console.log(ui.item.name + " " + ui.item.dose + " din="+ui.item.din + "demo="+params.demographic_no);
      onViewPrevention('AddPreventionData.jsp?prevention='+ui.item.name+'&demographic_no='+params.demographic_no+'&prevResultDesc=', null);    

      setTimeout(function () {
				const iframe = document.querySelector('iframe#prevention-preview');
      	const iframeDoc = iframe.contentDocument;
      	iframeDoc.getElementsByName('name')[0].value=ui.item.value;
        iframeDoc.getElementById('DIN').value=ui.item.din;
        iframeDoc.getElementsByName('route')[0].value=ui.item.route;
        iframeDoc.getElementsByName('dose')[0].value=ui.item.dose + " " + ui.item.units;
        iframeDoc.getElementById('manufacture').value=ui.item.manufacture;
    	}, 1000);

      }
    });
});
