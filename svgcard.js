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

SVG.extend(SVG.Container, {
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

  octagon: function(width, height, bevel) {
    return this.polygon([[bevel,0], [width-bevel,0], [width, bevel], [width, height-bevel], [width - bevel, height], [bevel, height], [0, height-bevel], [0, bevel]]);
  },
});

SVG.extend(SVG.Element, {
  addOutline: function() {
    const item = this.root().remember('item');
    return this.clone().attr({"stroke": item.backgroundColor, 'stroke-width': '3px', 'stroke-linejoin': 'round'}).insertBefore(this);
  },
  styleStroke: function() {
    const item = this.root().remember('item');
    this.attr({'fill': item.backgroundColor, 'stroke': item.foregroundColor, 'stroke-width': '1px' });
    return this;
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

  let draw = SVG().addTo('body').size(150 * item.width, 150 * item.height).viewbox(0, 0, 150 * item.width, 150 * item.height);
  draw.remember('item', item);

  let d = draw.rect(draw.width()-2, draw.height()-2).move(1, 1).attr({
    'fill': item.backgroundColor,
    'stroke': item.border ? item.foregroundColor : item.backgroundColor,
    'stroke-width': '2px'});

  if ('backgroundImage' in item && item.backgroundImage.length) {
    var bg = draw.pattern(0, 0, function(add) {
      let image = add.image(item.backgroundImage, function(event) {
        bg.width(image.width());
        bg.height(image.height());
      });
    });
    d.attr("fill", bg);
    if (!item.border) d.attr('stroke', bg);
  }

  if (item.divider) {
    draw.line(1, 35, draw.width()-2, 35).styleStroke();
    contentTop = 35;
  }

  if (item.imageSource.length) {
    let i = draw.image(item.imageSource, function (event) {
      const maxWidth = draw.width() - padding * 4;
      const maxHeight = draw.height() - 35 - padding * 4;
      i.size(maxWidth, maxHeight).center(draw.width()/2, ((draw.height()-35)/2)+35);
    }).css('mix-blend-mode', 'multiply');
    /* TODO still CSS */
  }

  if (item.star) draw.star(5, 11, 5).center(17, 35/2).attr('fill', item.foregroundColor);

  if (item.name.length) {
    draw.plain(item.name).move(item.star ? 32 : padding, 11).fill(item.foregroundColor).font({family: 'BrokenscriptOT-CondBold, ff-brokenscript-bc-web, serif', size: '20px'});
  }

  for (let i = 0; i < item.usage; i++) {
    const x = padding + (i % 3) * 18;
    const y = 35 + 10 + Math.floor(i / 3) * 18;
    draw.circle(15).move(x, y).styleStroke().attr('fill', 'white').addOutline();
    contentTop = Math.max(contentTop, y + 15);
  }

  if (item.damage.length) {
    let group = draw.group();
    let label = group.plain(item.damage);
    label.fill(item.foregroundColor);
    label.font({family: 'InterstateCondensed-Bold, interstate-condensed, sans-serif', weight: 'bold', size: '16px'})

    let bbox = label.bbox().grow(5);
    let shape = item.armour ? group.octagon(bbox.width, bbox.height, 5) : group.rect(bbox.width, bbox.height);
    let box = shape.move(bbox.x, bbox.y).styleStroke().insertBefore(label).addOutline();
    group.move(draw.width() - padding - bbox.width, 35 + padding);
    contentTop = Math.max(contentTop, group.y() + group.height())
  }

  if (item.classDetail.length) {
    let label = draw.plain(item.classDetail).move(padding, draw.height() - padding - 17);
    label.fill(item.foregroundColor);
    label.font({family: 'InterstateCondensed-Bold, interstate-condensed, sans-serif', weight: 'bold', size: '15px'})
    label.addOutline();
  }

  if (item.mechanicDetail.length) {
    let text = draw.text(function(t) {
      t.fill(item.foregroundColor);
      t.font({family: 'InterstateCondensed-LightItalic, interstate-condensed, sans-serif', style: 'italic', size: '14px'})
      t.leading('1.2em');
      t.wrap(item.mechanicDetail, 150 - padding * 2);
    }).move(8, contentTop + padding/2).addOutline();
  }

  if (item.clearDetail.length) {
    let text = draw.text(function(t) {
      t.fill(item.foregroundColor);
      t.font({family: 'InterstateCondensed-LightItalic, interstate-condensed, sans-serif', style: 'italic', size: '14px'})
      t.leading('1.2em');
      t.tspan('Clear:').font('weight', 'bold').newLine();
      t.wrap(item.clearDetail, 150 - padding * 2);
    });
    text.move(padding, 150 - padding - text.bbox().height);
  }

  return draw;
}
