#!/bin/bash
if [ -f shortly.xpi ]; then
	echo "deleting existing build -> shortly.xpi"
	rm shortly.xpi
fi
zip -r shortly.xpi chrome chrome.manifest defaults gpl.txt install.rdf
echo "created build -> shortly.xpi"