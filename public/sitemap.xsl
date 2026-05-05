<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #333; margin: 0; padding: 40px; background: #f8fafc; }
					table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-top: 20px; }
					th { background: #f1f5f9; text-align: left; padding: 15px 20px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0; }
					td { padding: 15px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; word-break: break-all; }
					tr:last-child td { border-bottom: none; }
					tr:hover td { background: #f8fafc; }
					a { color: #ef3e36; text-decoration: none; font-weight: 600; }
					a:hover { text-decoration: underline; }
					.header { margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
					.header h1 { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0; }
					.header p { color: #64748b; margin: 0; font-size: 14px; font-weight: 500; }
					.back-link { display: inline-block; margin-top: 20px; font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
				</style>
			</head>
			<body>
				<div class="header">
					<h1>
						<xsl:choose>
							<xsl:when test="sitemap:sitemapindex">Sitemap Index</xsl:when>
							<xsl:otherwise>Sitemap</xsl:otherwise>
						</xsl:choose>
					</h1>
					<p>
						<xsl:choose>
							<xsl:when test="sitemap:sitemapindex">
								This index contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.
							</xsl:when>
							<xsl:otherwise>
								This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
							</xsl:otherwise>
						</xsl:choose>
					</p>
				</div>

				<xsl:choose>
					<xsl:when test="sitemap:sitemapindex">
						<table>
							<thead>
								<tr>
									<th>Sitemap URL</th>
									<th>Last Modified</th>
								</tr>
							</thead>
							<tbody>
								<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
									<tr>
										<td>
											<a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td>
											<xsl:value-of select="sitemap:lastmod"/>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</xsl:when>
					<xsl:otherwise>
						<a href="/sitemap_index.xml" class="back-link">← Back to Index</a>
						<table>
							<thead>
								<tr>
									<th>URL</th>
									<th>Change Freq.</th>
									<th>Priority</th>
									<th>Last Modified</th>
								</tr>
							</thead>
							<tbody>
								<xsl:for-each select="sitemap:urlset/sitemap:url">
									<tr>
										<td>
											<a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td>
											<xsl:value-of select="sitemap:changefreq"/>
										</td>
										<td>
											<xsl:value-of select="sitemap:priority"/>
										</td>
										<td>
											<xsl:value-of select="sitemap:lastmod"/>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</xsl:otherwise>
				</xsl:choose>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
