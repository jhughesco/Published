<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
  <xsl:param name="XMPAppDir" />
  <xsl:param name="AddSelectCmd"/>
  <xsl:param name="AddSubmitCmd"/>
  <xsl:param name="EditSelectCmd"/>
  <xsl:param name="EditSubmitCmd"/>
  <xsl:param name="Stylesheet"/>
  <xsl:param name="FormCssClass"/>
  <xsl:param name="LabelCssClass"/>
  <xsl:param name="RowCssClass"/>
  <xsl:param name="ValSummCssClass"/>
  <xsl:param name="ValTagCssClass"/>
  <xsl:param name="CommandButtonClass"/>
  <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
  <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
  <xsl:variable name="FormName" select="/Forms/@FormName"></xsl:variable>
  <xsl:variable name="LabelWidth" select="Forms/Style/@LabelWidth"></xsl:variable>
  <xsl:variable name="LabelAlign" select="translate(Forms/Style/@LabelAlign,$uppercase,$smallcase)"></xsl:variable>
  <xsl:variable name="KeyField" select="/Forms/Form/Data/@Key"></xsl:variable>
  <xsl:template match="/Forms/Form[@Type='Add']">
    <AddForm>
      <xsl:value-of select="$Stylesheet" disable-output-escaping="yes"/>
      <xsl:value-of select="$AddSubmitCmd" disable-output-escaping="yes"/>
      <xsl:for-each select="/Forms/Form/Controls/ControlDataSource">
        <xsl:element name="ControlDataSource">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
      <xsl:element name="div">
        <xsl:attribute name="class">
          <xsl:value-of select="$FormCssClass"/>
        </xsl:attribute>
        <xsl:for-each select="Controls/*">
          <xsl:choose>
            <xsl:when test="name()='Email'"></xsl:when>
            <xsl:when test="name()='ControlDataSource'"></xsl:when>
            <xsl:when test="name()='AddToRoles'"></xsl:when>
            <xsl:when test="name()='Redirect'"></xsl:when>
            <xsl:when test="name()='ValidationSummary'">
              <xsl:call-template name="ValidationSummary"></xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:element name="div">
                <xsl:attribute name="class">
                  <xsl:value-of select="$RowCssClass"/>
                </xsl:attribute>
                <xsl:choose>
                  <xsl:when test="name()='CommandButtons'">
                    <xsl:element name="Label">
                      <xsl:attribute name="class">
                        <xsl:value-of select="$LabelCssClass"/>
                      </xsl:attribute>
                      <xsl:text disable-output-escaping="yes"><![CDATA[&nbsp;]]></xsl:text>
                    </xsl:element>
                    <xsl:for-each select="./AddButton|./AddLink|./AddImage|./CancelButton|./CancelImage|./CancelLink">
                      <xsl:copy-of select="."/>
                    </xsl:for-each>
                  </xsl:when>
                  <xsl:when test="name()='Label'">
                    <xsl:element name="Label">
                      <xsl:copy-of select="@*"/>
                      <xsl:value-of select="." disable-output-escaping="yes" />
                    </xsl:element>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:call-template name="FormControl" />
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:element>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:for-each>
      </xsl:element>
      <xsl:for-each select="//Email[@SendRule='add']|//Email[@SendRule='both']">
        <xsl:element name="Email">
          <xsl:attribute name="To">
            <xsl:value-of select="@To"/>
          </xsl:attribute>
          <xsl:attribute name="CC">
            <xsl:value-of select="@CC"/>
          </xsl:attribute>
          <xsl:attribute name="BCC">
            <xsl:value-of select="@BCC"/>
          </xsl:attribute>
          <xsl:attribute name="From">
            <xsl:value-of select="@From"/>
          </xsl:attribute>
          <xsl:attribute name="ReplyTo">
            <xsl:value-of select="@ReplyTo"/>
          </xsl:attribute>
          <xsl:attribute name="Format">
            <xsl:value-of select="@Format"/>
          </xsl:attribute>
          <xsl:attribute name="Subject">
            <xsl:value-of select="@Subject"/>
          </xsl:attribute>
          <xsl:value-of select="." disable-output-escaping="yes" />
        </xsl:element>
      </xsl:for-each>
      <xsl:for-each select="//AddToRoles">
        <xsl:element name="AddToRoles">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
      <xsl:for-each select="//Redirect">
        <xsl:element name="Redirect">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
    </AddForm>

    <EditForm>
      <xsl:value-of select="$Stylesheet" disable-output-escaping="yes"/>
      <xsl:value-of select="$EditSelectCmd" disable-output-escaping="yes"/>
      <xsl:value-of select="$EditSubmitCmd" disable-output-escaping="yes"/>
      <xsl:for-each select="/Forms/Form/Controls/ControlDataSource">
        <xsl:element name="ControlDataSource">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
      <xsl:element name="div">
        <xsl:attribute name="class">
          <xsl:value-of select="$FormCssClass"/>
        </xsl:attribute>
        <xsl:for-each select="Controls/*">
          <xsl:choose>
            <xsl:when test="name()='Email'"></xsl:when>
            <xsl:when test="name()='ControlDataSource'"></xsl:when>
            <xsl:when test="name()='AddToRoles'"></xsl:when>
            <xsl:when test="name()='Redirect'"></xsl:when>
            <xsl:when test="name()='ValidationSummary'">
              <xsl:call-template name="ValidationSummary"></xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:element name="div">
                <xsl:attribute name="class">
                  <xsl:value-of select="$RowCssClass"/>
                </xsl:attribute>
                <xsl:choose>
                  <xsl:when test="name()='CommandButtons'">
                    <xsl:element name="Label">
                      <xsl:attribute name="class">
                        <xsl:value-of select="$LabelCssClass"/>
                      </xsl:attribute>
                      <xsl:text disable-output-escaping="yes"><![CDATA[&nbsp;]]></xsl:text>
                    </xsl:element>
                    <xsl:for-each select="./UpdateButton|./UpdateLink|./UpdateImage|./CancelButton|./CancelImage|./CancelLink">
                      <xsl:copy-of select="."/>
                    </xsl:for-each>
                  </xsl:when>
                  <xsl:when test="name()='Label'">
                    <xsl:element name="Label">
                      <xsl:copy-of select="@*"/>
                      <xsl:value-of select="." disable-output-escaping="yes" />
                    </xsl:element>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:call-template name="FormControl" />
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:element>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:for-each>
      </xsl:element>
      <xsl:if test="$KeyField != ''">
        <TextBox Visible="False" Id="{$KeyField}" DataField="{$KeyField}"/>       
      </xsl:if>
      <xsl:for-each select="//Email[@SendRule='edit']|//Email[@SendRule='both']">
        <xsl:element name="Email">
          <xsl:attribute name="To">
            <xsl:value-of select="@To"/>
          </xsl:attribute>
          <xsl:attribute name="From">
            <xsl:value-of select="@From"/>
          </xsl:attribute>
          <xsl:attribute name="Format">
            <xsl:value-of select="@Format"/>
          </xsl:attribute>
          <xsl:attribute name="Subject">
            <xsl:value-of select="@Subject"/>
          </xsl:attribute>
          <xsl:value-of select="." disable-output-escaping="yes" />
        </xsl:element>
      </xsl:for-each>
      <xsl:for-each select="//AddToRoles">
        <xsl:element name="AddToRoles">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
      <xsl:for-each select="//Redirect">
        <xsl:element name="Redirect">
          <xsl:copy-of select="@*"/>
        </xsl:element>
      </xsl:for-each>
    </EditForm>
  </xsl:template>
  
  <xsl:template name="FormControl">
    <xsl:call-template name="Label">
      <xsl:with-param name="for" select="@Id"></xsl:with-param>
    </xsl:call-template>
    <xsl:element name="{name()}">
      <xsl:copy-of select="@*" />
      <xsl:if test="contains(name(), 'List')">
        <xsl:call-template name="ListItems" />
      </xsl:if>
    </xsl:element>
    <xsl:call-template name="Calendar" />
    <xsl:call-template name="Validate" />
  </xsl:template>
  <xsl:template name="Label">
    <xsl:param name="for"></xsl:param>
    <Label>
      <xsl:attribute name="For">
        <xsl:value-of select="$for"/>
      </xsl:attribute>
      <xsl:attribute name="CssClass">
        <xsl:value-of select="$LabelCssClass"/>
      </xsl:attribute>
      <xsl:copy-of select="Label/@*"/>
      <xsl:value-of select="Label/."/>
    </Label>
  </xsl:template>
  <xsl:template name="ListItems">
    <xsl:for-each select="ListItem">
      <ListItem>
        <xsl:copy-of select="@*"/>
        <xsl:value-of select="."/>
      </ListItem>
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="Calendar">
    <xsl:for-each select="./Calendar">
      <CalendarImage ImageUrl="~/DesktopModules/XModPro/images/calendar.jpg" Style="margin-left:5px;">
        <xsl:copy-of select="@*"/>
      </CalendarImage>
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="Validate">
    <xsl:for-each select="./Validate">
      <Validate Target="{../@Id}">
        <xsl:attribute name="CssClass">
          <xsl:value-of select="$ValTagCssClass"/>
        </xsl:attribute>
        <xsl:copy-of select="@*"/>
      </Validate>
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="ValidationSummary">
      <ValidationSummary>
        <xsl:attribute name="CssClass">
          <xsl:value-of select="$ValTagCssClass"/>
        </xsl:attribute>
        <xsl:copy-of select="@*"/>
      </ValidationSummary>
  </xsl:template>
</xsl:stylesheet>
