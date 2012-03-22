<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <xsl:output method="xml" indent="yes"/>
  <xsl:template match="/">
    <fo:root>
      <fo:layout-master-set>
        <fo:simple-page-master master-name="A4-portrait"
              page-height="29.7cm" page-width="21.0cm" margin="2cm" font-family="Arial">
          <fo:region-body/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      <fo:page-sequence master-reference="A4-portrait">
        <fo:flow flow-name="xsl-region-body">
          <fo:block font-family="Arial" font-size="12pt" font-weight="normal" font-style="normal">
            Документ от <xsl:value-of select="palm_sale/ddate"/>
			<fo:table border="0.5pt solid black" text-align="center" font-size="10pt">
			  <fo:table-column column-width="100mm"/>
			  <fo:table-column column-width="25mm"/>
			  <fo:table-column column-width="25mm"/>
			  <fo:table-column column-width="25mm"/>
			  <fo:table-header>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> Товар </fo:block>
				  </fo:table-cell>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> Кол-во </fo:block>
				  </fo:table-cell>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> Цена </fo:block>
				  </fo:table-cell>
 				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> Сумма </fo:block>
				  </fo:table-cell>			  
			  </fo:table-header>
			  <fo:table-body>
				<xsl:for-each select="palm_sale/saleitem">
					<fo:table-row>
					  <fo:table-cell padding="3pt" border="0.5pt solid black">
						<fo:block text-align="left"> <xsl:value-of select="@name"/> </fo:block>
					  </fo:table-cell>
					  <fo:table-cell padding="3pt" border="0.5pt solid black">
						<fo:block text-align="right"> <xsl:value-of select="@volume"/> </fo:block>
					  </fo:table-cell>
					  <fo:table-cell padding="3pt" border="0.5pt solid black">
						<fo:block text-align="right"> <xsl:value-of select="@price"/> </fo:block>
					  </fo:table-cell>
					  <fo:table-cell padding="3pt" border="0.5pt solid black">
						<fo:block text-align="right"> <xsl:value-of select="@cost"/> </fo:block>
					  </fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
				<fo:table-row>
				  <fo:table-cell padding="3pt" border="0.5pt solid black"  font-weight="bold" >
					<fo:block text-align="left"> Итого </fo:block>
				  </fo:table-cell>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> </fo:block>
				  </fo:table-cell>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block> </fo:block>
				  </fo:table-cell>
				  <fo:table-cell padding="3pt" border="0.5pt solid black">
					<fo:block text-align="right" font-weight="bold"><xsl:value-of select="palm_sale/summ"/></fo:block>
				  </fo:table-cell>
				</fo:table-row>
			  </fo:table-body>
			</fo:table>
          </fo:block>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>
