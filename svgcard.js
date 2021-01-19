'use strict';

SVG.extend(SVG.Box, {
  grow: function(amount) {
    this.x -= amount;
    this.y -= amount;
    this.width += amount * 2;
    this.height += amount * 2;
    return this;
  }
});

SVG.extend(SVG.Svg, {
  star: function(spikes, outer, inner) {
    let points = [];
    const degrees = 360/spikes;
    for (let i = 0; i < spikes; i++) {
      let a = i * degrees + 90
      let x = outer + inner * Math.cos(a * Math.PI / 180)
      let y = outer + inner * Math.sin(a * Math.PI / 180)

      points.push([x, y])

      a += degrees / 2
      x = outer + outer * Math.cos(a * Math.PI / 180)
      y = outer + outer * Math.sin(a * Math.PI / 180)

      points.push([x, y])
    }
    return this.polyline(points);
  },

  scopedStyle: function(selector, rules) {
    // These two lines can just use style() when upgrading svgjs
    let style = this.findOne('style');
    if (!style) style = this.put(new SVG.Style());
    // This is faking <style scoped>
    style.rule(`#${this.id()} ${selector}`, rules);
  }
});

SVG.extend(SVG.Element, {
  addOutline: function() {
    this.clone().addClass('outline').insertBefore(this);
  }
});

SVG.extend(SVG.Text, {
  wrap: function(string, maxWidth) {
    const words = string.split(/\s+/);
    let span = this.tspan('');
    let line = ''
    for(let n = 0; n < words.length; n++) {
      span.text(line + words[n] + ' ');
      if (span.length() > maxWidth && n > 0) {
        span.text(line);
        span.newLine();
        span = this.tspan(words[n] + '');
        line = words[n] + ' ';
      } else {
        line = span.text()
      }
    }
    span.newLine();
  }
});

function renderItem(item) {
  const padding = 8;
  let contentTop = 32;

  let draw = SVG().addTo('body').size(150 * item.width, 150 * item.height);

  draw.put(new SVG.Style()).words('@import url(https://use.typekit.net/srk3hpl.css);')
  draw.scopedStyle('.back', {fill: item.backgroundColor, stroke: item.foregroundColor, 'stroke-width': '2px'});
  draw.scopedStyle('.stroke', {fill: item.backgroundColor, stroke: item.foregroundColor, 'stroke-width': '2px' });
  draw.scopedStyle('.header', {fill: item.foregroundColor, font: '20px ff-brokenscript-bc-web, serif' });
  draw.scopedStyle('text.damage', {fill: item.foregroundColor, font: 'bold 16px interstate-condensed, sans-serif' });
  draw.scopedStyle('.mechanics', {fill: item.foregroundColor, font: 'italic 14px interstate-condensed, sans-serif' });
  draw.scopedStyle('.clear', {fill: item.foregroundColor, font: '14px interstate-condensed, sans-serif' });
  draw.scopedStyle('.outline', {stroke: item.backgroundColor, 'stroke-width': '4px', 'stroke-linejoin': 'round' });
  draw.scopedStyle('.detail', {fill: item.foregroundColor, font: 'bold 15px interstate-condensed, sans-serif'});
  draw.scopedStyle('.star', {fill: item.foregroundColor});

  let d = draw.rect(draw.width()-2, draw.height()-2).move(1, 1).addClass('back');
  d.css('stroke', item.border ? item.foregroundColor : item.backgroundColor);

  if ('backgroundImage' in item && item.backgroundImage.length) {
    var bg = draw.pattern(0, 0, function(add) {
      let image = add.image(item.backgroundImage, function(event) {
        bg.width(image.width());
        bg.height(image.height());
      });
    });
    d.css("fill", bg);
    if (!item.border) d.css('stroke', bg);
  }

  if (item.divider) {
    draw.line(1, 35, draw.width()-2, 35).addClass('stroke');
    contentTop = 35;
  }

  if (item.imageSource.length) {
    let i = draw.image(item.imageSource, function (event) {
      const maxWidth = draw.width() - padding * 4;
      const maxHeight = draw.height() - 35 - padding * 4;
      i.size(maxWidth, maxHeight).center(draw.width()/2, ((draw.height()-35)/2)+35);
    }).css('mix-blend-mode', 'multiply');
  }

  if (item.star) draw.star(5, 11, 5).center(17, 35/2).addClass('star');

  if (item.name.length) {
    draw.plain(item.name).move(item.star ? 32 : padding, 11).addClass('header');
  }

  for (let i = 0; i < item.usage; i++) {
    const x = padding + (i % 3) * 18;
    const y = 35 + 10 + Math.floor(i / 3) * 18;
    draw.circle(15).move(x, y).addClass('stroke').css('fill', 'white').addOutline();
    contentTop = Math.max(contentTop, y + 15);
  }

  if (item.damage.length) {
    let group = draw.group();
    let label = group.plain(item.damage).addClass('damage');
    let bbox = label.bbox().grow(5);
    let box = group.rect(bbox.width, bbox.height).move(bbox.x, bbox.y).addClass('stroke').insertBefore(label).addOutline();
    group.move(draw.width() - padding - bbox.width, 35 + padding);
    contentTop = Math.max(contentTop, group.y() + group.height())
  }

  if (item.classDetail.length) {
    let label = draw.plain(item.classDetail).move(padding, draw.height() - padding - 17).addClass('detail').addOutline();
  }

  if (item.mechanicDetail.length) {
    let text = draw.text(function(t) {
      t.addClass('mechanics');
      t.leading('1.2em');
      t.wrap(item.mechanicDetail, 150 - padding * 2);
    }).move(8, contentTop + padding/2).addOutline();
  }

  if (item.clearDetail.length) {
    let text = draw.text(function(t) {
      t.addClass('clear');
      t.leading('1.2em');
      t.tspan('Clear:').font('weight', 'bold').newLine();
      t.wrap(item.clearDetail, 150 - padding * 2);
    });
    text.move(padding, 150 - padding - text.bbox().height);
  }
}
