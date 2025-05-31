import { k as ce, q as qn, b as z, f as wt, cg as _n, a as Tt, ch as Hn, p as Vn, j as N, ci as zn, l as Un, R as $n, z as Gn, n as Kn, H as Jn, m as jn } from "./index-eea9098a.mjs";
import { E as p, F as de, v as Re, S as we, o as d, w as _e, C as Qn, x as Yn, y as Ot, z as It, A as Ce, B as Pt, G as Wt, H as Ft, J as $e, K as et, M as w, O as X, g as tt, b as Ge, Q as Zn, R as te, V as Nt, U as x, W as Xn, X as er, Y as ue, Z as B, _ as tr, $ as nr, a0 as nt, a1 as he, a2 as rr, a3 as or, a4 as ir, a5 as sr, a6 as lr, a7 as ar, a8 as cr, a9 as ur, aa as hr, ab as fr, ac as dr, ad as mr, ae as gr, af as pr, ag as qt, ah as yr, ai as xr, aj as kr, ak as br, al as Sr, am as Cr, an as _t, ao as vr, ap as Ar, t as f, aq as Mr } from "./index-9cc1df42.mjs";
const Lr = (t) => {
  let { state: e } = t, r = e.doc.lineAt(e.selection.main.from), n = ot(t.state, r.from);
  return n.line ? Br(t) : n.block ? Er(t) : !1;
};
function rt(t, e) {
  return ({ state: r, dispatch: n }) => {
    if (r.readOnly)
      return !1;
    let o = t(e, r);
    return o ? (n(r.update(o)), !0) : !1;
  };
}
const Br = /* @__PURE__ */ rt(
  Tr,
  0
  /* CommentOption.Toggle */
), Dr = /* @__PURE__ */ rt(
  Ht,
  0
  /* CommentOption.Toggle */
), Er = /* @__PURE__ */ rt(
  (t, e) => Ht(t, e, wr(e)),
  0
  /* CommentOption.Toggle */
);
function ot(t, e) {
  let r = t.languageDataAt("commentTokens", e);
  return r.length ? r[0] : {};
}
const ae = 50;
function Rr(t, { open: e, close: r }, n, o) {
  let i = t.sliceDoc(n - ae, n), s = t.sliceDoc(o, o + ae), l = /\s*$/.exec(i)[0].length, a = /^\s*/.exec(s)[0].length, c = i.length - l;
  if (i.slice(c - e.length, c) == e && s.slice(a, a + r.length) == r)
    return {
      open: { pos: n - l, margin: l && 1 },
      close: { pos: o + a, margin: a && 1 }
    };
  let u, h;
  o - n <= 2 * ae ? u = h = t.sliceDoc(n, o) : (u = t.sliceDoc(n, n + ae), h = t.sliceDoc(o - ae, o));
  let m = /^\s*/.exec(u)[0].length, k = /\s*$/.exec(h)[0].length, C = h.length - k - r.length;
  return u.slice(m, m + e.length) == e && h.slice(C, C + r.length) == r ? {
    open: {
      pos: n + m + e.length,
      margin: /\s/.test(u.charAt(m + e.length)) ? 1 : 0
    },
    close: {
      pos: o - k - r.length,
      margin: /\s/.test(h.charAt(C - 1)) ? 1 : 0
    }
  } : null;
}
function wr(t) {
  let e = [];
  for (let r of t.selection.ranges) {
    let n = t.doc.lineAt(r.from), o = r.to <= n.to ? n : t.doc.lineAt(r.to), i = e.length - 1;
    i >= 0 && e[i].to > n.from ? e[i].to = o.to : e.push({ from: n.from + /^\s*/.exec(n.text)[0].length, to: o.to });
  }
  return e;
}
function Ht(t, e, r = e.selection.ranges) {
  let n = r.map((i) => ot(e, i.from).block);
  if (!n.every((i) => i))
    return null;
  let o = r.map((i, s) => Rr(e, n[s], i.from, i.to));
  if (t != 2 && !o.every((i) => i))
    return { changes: e.changes(r.map((i, s) => o[s] ? [] : [{ from: i.from, insert: n[s].open + " " }, { from: i.to, insert: " " + n[s].close }])) };
  if (t != 1 && o.some((i) => i)) {
    let i = [];
    for (let s = 0, l; s < o.length; s++)
      if (l = o[s]) {
        let a = n[s], { open: c, close: u } = l;
        i.push({ from: c.pos - a.open.length, to: c.pos + c.margin }, { from: u.pos - u.margin, to: u.pos + a.close.length });
      }
    return { changes: i };
  }
  return null;
}
function Tr(t, e, r = e.selection.ranges) {
  let n = [], o = -1;
  for (let { from: i, to: s } of r) {
    let l = n.length, a = 1e9, c = ot(e, i).line;
    if (c) {
      for (let u = i; u <= s; ) {
        let h = e.doc.lineAt(u);
        if (h.from > o && (i == s || s > h.from)) {
          o = h.from;
          let m = /^\s*/.exec(h.text)[0].length, k = m == h.length, C = h.text.slice(m, m + c.length) == c ? m : -1;
          m < h.text.length && m < a && (a = m), n.push({ line: h, comment: C, token: c, indent: m, empty: k, single: !1 });
        }
        u = h.to + 1;
      }
      if (a < 1e9)
        for (let u = l; u < n.length; u++)
          n[u].indent < n[u].line.text.length && (n[u].indent = a);
      n.length == l + 1 && (n[l].single = !0);
    }
  }
  if (t != 2 && n.some((i) => i.comment < 0 && (!i.empty || i.single))) {
    let i = [];
    for (let { line: l, token: a, indent: c, empty: u, single: h } of n)
      (h || !u) && i.push({ from: l.from + c, insert: a + " " });
    let s = e.changes(i);
    return { changes: s, selection: e.selection.map(s, 1) };
  } else if (t != 1 && n.some((i) => i.comment >= 0)) {
    let i = [];
    for (let { line: s, comment: l, token: a } of n)
      if (l >= 0) {
        let c = s.from + l, u = c + a.length;
        s.text[u - s.from] == " " && u++, i.push({ from: c, to: u });
      }
    return { changes: i };
  }
  return null;
}
const Ke = /* @__PURE__ */ et.define(), Or = /* @__PURE__ */ et.define(), Ir = /* @__PURE__ */ de.define(), Vt = /* @__PURE__ */ de.define({
  combine(t) {
    return Re(t, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, r) => r
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, r) => (n, o) => e(n, o) || r(n, o)
    });
  }
});
function Pr(t) {
  let e = 0;
  return t.iterChangedRanges((r, n) => e = n), e;
}
const zt = /* @__PURE__ */ we.define({
  create() {
    return O.empty;
  },
  update(t, e) {
    let r = e.state.facet(Vt), n = e.annotation(Ke);
    if (n) {
      let a = e.docChanged ? d.single(Pr(e.changes)) : void 0, c = A.fromTransaction(e, a), u = n.side, h = u == 0 ? t.undone : t.done;
      return c ? h = ve(h, h.length, r.minDepth, c) : h = Gt(h, e.startState.selection), new O(u == 0 ? n.rest : h, u == 0 ? h : n.rest);
    }
    let o = e.annotation(Or);
    if ((o == "full" || o == "before") && (t = t.isolate()), e.annotation(_e.addToHistory) === !1)
      return e.changes.empty ? t : t.addMapping(e.changes.desc);
    let i = A.fromTransaction(e), s = e.annotation(_e.time), l = e.annotation(_e.userEvent);
    return i ? t = t.addChanges(i, s, l, r, e) : e.selection && (t = t.addSelection(e.startState.selection, s, l, r.newGroupDelay)), (o == "full" || o == "after") && (t = t.isolate()), t;
  },
  toJSON(t) {
    return { done: t.done.map((e) => e.toJSON()), undone: t.undone.map((e) => e.toJSON()) };
  },
  fromJSON(t) {
    return new O(t.done.map(A.fromJSON), t.undone.map(A.fromJSON));
  }
});
function Wr(t = {}) {
  return [
    zt,
    Vt.of(t),
    p.domEventHandlers({
      beforeinput(e, r) {
        let n = e.inputType == "historyUndo" ? Ut : e.inputType == "historyRedo" ? Je : null;
        return n ? (e.preventDefault(), n(r)) : !1;
      }
    })
  ];
}
function Te(t, e) {
  return function({ state: r, dispatch: n }) {
    if (!e && r.readOnly)
      return !1;
    let o = r.field(zt, !1);
    if (!o)
      return !1;
    let i = o.pop(t, r, e);
    return i ? (n(i), !0) : !1;
  };
}
const Ut = /* @__PURE__ */ Te(0, !1), Je = /* @__PURE__ */ Te(1, !1), Fr = /* @__PURE__ */ Te(0, !0), Nr = /* @__PURE__ */ Te(1, !0);
class A {
  constructor(e, r, n, o, i) {
    this.changes = e, this.effects = r, this.mapped = n, this.startSelection = o, this.selectionsAfter = i;
  }
  setSelAfter(e) {
    return new A(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, r, n;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (r = this.mapped) === null || r === void 0 ? void 0 : r.toJSON(),
      startSelection: (n = this.startSelection) === null || n === void 0 ? void 0 : n.toJSON(),
      selectionsAfter: this.selectionsAfter.map((o) => o.toJSON())
    };
  }
  static fromJSON(e) {
    return new A(e.changes && Qn.fromJSON(e.changes), [], e.mapped && Yn.fromJSON(e.mapped), e.startSelection && d.fromJSON(e.startSelection), e.selectionsAfter.map(d.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, r) {
    let n = D;
    for (let o of e.startState.facet(Ir)) {
      let i = o(e);
      i.length && (n = n.concat(i));
    }
    return !n.length && e.changes.empty ? null : new A(e.changes.invert(e.startState.doc), n, void 0, r || e.startState.selection, D);
  }
  static selection(e) {
    return new A(void 0, D, void 0, void 0, e);
  }
}
function ve(t, e, r, n) {
  let o = e + 1 > r + 20 ? e - r - 1 : 0, i = t.slice(o, e);
  return i.push(n), i;
}
function qr(t, e) {
  let r = [], n = !1;
  return t.iterChangedRanges((o, i) => r.push(o, i)), e.iterChangedRanges((o, i, s, l) => {
    for (let a = 0; a < r.length; ) {
      let c = r[a++], u = r[a++];
      l >= c && s <= u && (n = !0);
    }
  }), n;
}
function _r(t, e) {
  return t.ranges.length == e.ranges.length && t.ranges.filter((r, n) => r.empty != e.ranges[n].empty).length === 0;
}
function $t(t, e) {
  return t.length ? e.length ? t.concat(e) : t : e;
}
const D = [], Hr = 200;
function Gt(t, e) {
  if (t.length) {
    let r = t[t.length - 1], n = r.selectionsAfter.slice(Math.max(0, r.selectionsAfter.length - Hr));
    return n.length && n[n.length - 1].eq(e) ? t : (n.push(e), ve(t, t.length - 1, 1e9, r.setSelAfter(n)));
  } else
    return [A.selection([e])];
}
function Vr(t) {
  let e = t[t.length - 1], r = t.slice();
  return r[t.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), r;
}
function He(t, e) {
  if (!t.length)
    return t;
  let r = t.length, n = D;
  for (; r; ) {
    let o = zr(t[r - 1], e, n);
    if (o.changes && !o.changes.empty || o.effects.length) {
      let i = t.slice(0, r);
      return i[r - 1] = o, i;
    } else
      e = o.mapped, r--, n = o.selectionsAfter;
  }
  return n.length ? [A.selection(n)] : D;
}
function zr(t, e, r) {
  let n = $t(t.selectionsAfter.length ? t.selectionsAfter.map((l) => l.map(e)) : D, r);
  if (!t.changes)
    return A.selection(n);
  let o = t.changes.map(e), i = e.mapDesc(t.changes, !0), s = t.mapped ? t.mapped.composeDesc(i) : i;
  return new A(o, w.mapEffects(t.effects, e), s, t.startSelection.map(i), n);
}
const Ur = /^(input\.type|delete)($|\.)/;
class O {
  constructor(e, r, n = 0, o = void 0) {
    this.done = e, this.undone = r, this.prevTime = n, this.prevUserEvent = o;
  }
  isolate() {
    return this.prevTime ? new O(this.done, this.undone) : this;
  }
  addChanges(e, r, n, o, i) {
    let s = this.done, l = s[s.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!n || Ur.test(n)) && (!l.selectionsAfter.length && r - this.prevTime < o.newGroupDelay && o.joinToEvent(i, qr(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    n == "input.type.compose") ? s = ve(s, s.length - 1, o.minDepth, new A(e.changes.compose(l.changes), $t(e.effects, l.effects), l.mapped, l.startSelection, D)) : s = ve(s, s.length, o.minDepth, e), new O(s, D, r, n);
  }
  addSelection(e, r, n, o) {
    let i = this.done.length ? this.done[this.done.length - 1].selectionsAfter : D;
    return i.length > 0 && r - this.prevTime < o && n == this.prevUserEvent && n && /^select($|\.)/.test(n) && _r(i[i.length - 1], e) ? this : new O(Gt(this.done, e), this.undone, r, n);
  }
  addMapping(e) {
    return new O(He(this.done, e), He(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, r, n) {
    let o = e == 0 ? this.done : this.undone;
    if (o.length == 0)
      return null;
    let i = o[o.length - 1];
    if (n && i.selectionsAfter.length)
      return r.update({
        selection: i.selectionsAfter[i.selectionsAfter.length - 1],
        annotations: Ke.of({ side: e, rest: Vr(o) }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (i.changes) {
      let s = o.length == 1 ? D : o.slice(0, o.length - 1);
      return i.mapped && (s = He(s, i.mapped)), r.update({
        changes: i.changes,
        selection: i.startSelection,
        effects: i.effects,
        annotations: Ke.of({ side: e, rest: s }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
O.empty = /* @__PURE__ */ new O(D, D);
const $r = [
  { key: "Mod-z", run: Ut, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Je, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: Je, preventDefault: !0 },
  { key: "Mod-u", run: Fr, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Nr, preventDefault: !0 }
];
function oe(t, e) {
  return d.create(t.ranges.map(e), t.mainIndex);
}
function I(t, e) {
  return t.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function T({ state: t, dispatch: e }, r) {
  let n = oe(t.selection, r);
  return n.eq(t.selection) ? !1 : (e(I(t, n)), !0);
}
function Oe(t, e) {
  return d.cursor(e ? t.to : t.from);
}
function Kt(t, e) {
  return T(t, (r) => r.empty ? t.moveByChar(r, e) : Oe(r, e));
}
function S(t) {
  return t.textDirectionAt(t.state.selection.main.head) == Zn.LTR;
}
const Jt = (t) => Kt(t, !S(t)), jt = (t) => Kt(t, S(t));
function Qt(t, e) {
  return T(t, (r) => r.empty ? t.moveByGroup(r, e) : Oe(r, e));
}
const Gr = (t) => Qt(t, !S(t)), Kr = (t) => Qt(t, S(t));
function Jr(t, e, r) {
  if (e.type.prop(r))
    return !0;
  let n = e.to - e.from;
  return n && (n > 2 || /[^\s,.;:]/.test(t.sliceDoc(e.from, e.to))) || e.firstChild;
}
function Ie(t, e, r) {
  let n = tt(t).resolveInner(e.head), o = r ? Ge.closedBy : Ge.openedBy;
  for (let a = e.head; ; ) {
    let c = r ? n.childAfter(a) : n.childBefore(a);
    if (!c)
      break;
    Jr(t, c, o) ? n = c : a = r ? c.to : c.from;
  }
  let i = n.type.prop(o), s, l;
  return i && (s = r ? X(t, n.from, 1) : X(t, n.to, -1)) && s.matched ? l = r ? s.end.to : s.end.from : l = r ? n.to : n.from, d.cursor(l, r ? -1 : 1);
}
const jr = (t) => T(t, (e) => Ie(t.state, e, !S(t))), Qr = (t) => T(t, (e) => Ie(t.state, e, S(t)));
function Yt(t, e) {
  return T(t, (r) => {
    if (!r.empty)
      return Oe(r, e);
    let n = t.moveVertically(r, e);
    return n.head != r.head ? n : t.moveToLineBoundary(r, e);
  });
}
const Zt = (t) => Yt(t, !1), Xt = (t) => Yt(t, !0);
function en(t) {
  let e = t.scrollDOM.clientHeight < t.scrollDOM.scrollHeight - 2, r = 0, n = 0, o;
  if (e) {
    for (let i of t.state.facet(p.scrollMargins)) {
      let s = i(t);
      s != null && s.top && (r = Math.max(s == null ? void 0 : s.top, r)), s != null && s.bottom && (n = Math.max(s == null ? void 0 : s.bottom, n));
    }
    o = t.scrollDOM.clientHeight - r - n;
  } else
    o = (t.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: r,
    marginBottom: n,
    selfScroll: e,
    height: Math.max(t.defaultLineHeight, o - 5)
  };
}
function tn(t, e) {
  let r = en(t), { state: n } = t, o = oe(n.selection, (s) => s.empty ? t.moveVertically(s, e, r.height) : Oe(s, e));
  if (o.eq(n.selection))
    return !1;
  let i;
  if (r.selfScroll) {
    let s = t.coordsAtPos(n.selection.main.head), l = t.scrollDOM.getBoundingClientRect(), a = l.top + r.marginTop, c = l.bottom - r.marginBottom;
    s && s.top > a && s.bottom < c && (i = p.scrollIntoView(o.main.head, { y: "start", yMargin: s.top - a }));
  }
  return t.dispatch(I(n, o), { effects: i }), !0;
}
const ht = (t) => tn(t, !1), je = (t) => tn(t, !0);
function _(t, e, r) {
  let n = t.lineBlockAt(e.head), o = t.moveToLineBoundary(e, r);
  if (o.head == e.head && o.head != (r ? n.to : n.from) && (o = t.moveToLineBoundary(e, r, !1)), !r && o.head == n.from && n.length) {
    let i = /^\s*/.exec(t.state.sliceDoc(n.from, Math.min(n.from + 100, n.to)))[0].length;
    i && e.head != n.from + i && (o = d.cursor(n.from + i));
  }
  return o;
}
const Yr = (t) => T(t, (e) => _(t, e, !0)), Zr = (t) => T(t, (e) => _(t, e, !1)), Xr = (t) => T(t, (e) => _(t, e, !S(t))), eo = (t) => T(t, (e) => _(t, e, S(t))), to = (t) => T(t, (e) => d.cursor(t.lineBlockAt(e.head).from, 1)), no = (t) => T(t, (e) => d.cursor(t.lineBlockAt(e.head).to, -1));
function ro(t, e, r) {
  let n = !1, o = oe(t.selection, (i) => {
    let s = X(t, i.head, -1) || X(t, i.head, 1) || i.head > 0 && X(t, i.head - 1, 1) || i.head < t.doc.length && X(t, i.head + 1, -1);
    if (!s || !s.end)
      return i;
    n = !0;
    let l = s.start.from == i.head ? s.end.to : s.end.from;
    return r ? d.range(i.anchor, l) : d.cursor(l);
  });
  return n ? (e(I(t, o)), !0) : !1;
}
const oo = ({ state: t, dispatch: e }) => ro(t, e, !1);
function E(t, e) {
  let r = oe(t.state.selection, (n) => {
    let o = e(n);
    return d.range(n.anchor, o.head, o.goalColumn, o.bidiLevel || void 0);
  });
  return r.eq(t.state.selection) ? !1 : (t.dispatch(I(t.state, r)), !0);
}
function nn(t, e) {
  return E(t, (r) => t.moveByChar(r, e));
}
const rn = (t) => nn(t, !S(t)), on = (t) => nn(t, S(t));
function sn(t, e) {
  return E(t, (r) => t.moveByGroup(r, e));
}
const io = (t) => sn(t, !S(t)), so = (t) => sn(t, S(t)), lo = (t) => E(t, (e) => Ie(t.state, e, !S(t))), ao = (t) => E(t, (e) => Ie(t.state, e, S(t)));
function ln(t, e) {
  return E(t, (r) => t.moveVertically(r, e));
}
const an = (t) => ln(t, !1), cn = (t) => ln(t, !0);
function un(t, e) {
  return E(t, (r) => t.moveVertically(r, e, en(t).height));
}
const ft = (t) => un(t, !1), dt = (t) => un(t, !0), co = (t) => E(t, (e) => _(t, e, !0)), uo = (t) => E(t, (e) => _(t, e, !1)), ho = (t) => E(t, (e) => _(t, e, !S(t))), fo = (t) => E(t, (e) => _(t, e, S(t))), mo = (t) => E(t, (e) => d.cursor(t.lineBlockAt(e.head).from)), go = (t) => E(t, (e) => d.cursor(t.lineBlockAt(e.head).to)), mt = ({ state: t, dispatch: e }) => (e(I(t, { anchor: 0 })), !0), gt = ({ state: t, dispatch: e }) => (e(I(t, { anchor: t.doc.length })), !0), pt = ({ state: t, dispatch: e }) => (e(I(t, { anchor: t.selection.main.anchor, head: 0 })), !0), yt = ({ state: t, dispatch: e }) => (e(I(t, { anchor: t.selection.main.anchor, head: t.doc.length })), !0), po = ({ state: t, dispatch: e }) => (e(t.update({ selection: { anchor: 0, head: t.doc.length }, userEvent: "select" })), !0), yo = ({ state: t, dispatch: e }) => {
  let r = We(t).map(({ from: n, to: o }) => d.range(n, Math.min(o + 1, t.doc.length)));
  return e(t.update({ selection: d.create(r), userEvent: "select" })), !0;
}, xo = ({ state: t, dispatch: e }) => {
  let r = oe(t.selection, (n) => {
    var o;
    let i = tt(t).resolveInner(n.head, 1);
    for (; !(i.from < n.from && i.to >= n.to || i.to > n.to && i.from <= n.from || !(!((o = i.parent) === null || o === void 0) && o.parent)); )
      i = i.parent;
    return d.range(i.to, i.from);
  });
  return e(I(t, r)), !0;
}, ko = ({ state: t, dispatch: e }) => {
  let r = t.selection, n = null;
  return r.ranges.length > 1 ? n = d.create([r.main]) : r.main.empty || (n = d.create([d.cursor(r.main.head)])), n ? (e(I(t, n)), !0) : !1;
};
function Pe(t, e) {
  if (t.state.readOnly)
    return !1;
  let r = "delete.selection", { state: n } = t, o = n.changeByRange((i) => {
    let { from: s, to: l } = i;
    if (s == l) {
      let a = e(s);
      a < s ? (r = "delete.backward", a = ye(t, a, !1)) : a > s && (r = "delete.forward", a = ye(t, a, !0)), s = Math.min(s, a), l = Math.max(l, a);
    } else
      s = ye(t, s, !1), l = ye(t, l, !0);
    return s == l ? { range: i } : { changes: { from: s, to: l }, range: d.cursor(s) };
  });
  return o.changes.empty ? !1 : (t.dispatch(n.update(o, {
    scrollIntoView: !0,
    userEvent: r,
    effects: r == "delete.selection" ? p.announce.of(n.phrase("Selection deleted")) : void 0
  })), !0);
}
function ye(t, e, r) {
  if (t instanceof p)
    for (let n of t.state.facet(p.atomicRanges).map((o) => o(t)))
      n.between(e, e, (o, i) => {
        o < e && i > e && (e = r ? i : o);
      });
  return e;
}
const hn = (t, e) => Pe(t, (r) => {
  let { state: n } = t, o = n.doc.lineAt(r), i, s;
  if (!e && r > o.from && r < o.from + 200 && !/[^ \t]/.test(i = o.text.slice(0, r - o.from))) {
    if (i[i.length - 1] == "	")
      return r - 1;
    let l = Ft(i, n.tabSize), a = l % $e(n) || $e(n);
    for (let c = 0; c < a && i[i.length - 1 - c] == " "; c++)
      r--;
    s = r;
  } else
    s = te(o.text, r - o.from, e, e) + o.from, s == r && o.number != (e ? n.doc.lines : 1) && (s += e ? 1 : -1);
  return s;
}), Qe = (t) => hn(t, !1), fn = (t) => hn(t, !0), dn = (t, e) => Pe(t, (r) => {
  let n = r, { state: o } = t, i = o.doc.lineAt(n), s = o.charCategorizer(n);
  for (let l = null; ; ) {
    if (n == (e ? i.to : i.from)) {
      n == r && i.number != (e ? o.doc.lines : 1) && (n += e ? 1 : -1);
      break;
    }
    let a = te(i.text, n - i.from, e) + i.from, c = i.text.slice(Math.min(n, a) - i.from, Math.max(n, a) - i.from), u = s(c);
    if (l != null && u != l)
      break;
    (c != " " || n != r) && (l = u), n = a;
  }
  return n;
}), mn = (t) => dn(t, !1), bo = (t) => dn(t, !0), gn = (t) => Pe(t, (e) => {
  let r = t.lineBlockAt(e).to;
  return e < r ? r : Math.min(t.state.doc.length, e + 1);
}), So = (t) => Pe(t, (e) => {
  let r = t.lineBlockAt(e).from;
  return e > r ? r : Math.max(0, e - 1);
}), Co = ({ state: t, dispatch: e }) => {
  if (t.readOnly)
    return !1;
  let r = t.changeByRange((n) => ({
    changes: { from: n.from, to: n.to, insert: Pt.of(["", ""]) },
    range: d.cursor(n.from)
  }));
  return e(t.update(r, { scrollIntoView: !0, userEvent: "input" })), !0;
}, vo = ({ state: t, dispatch: e }) => {
  if (t.readOnly)
    return !1;
  let r = t.changeByRange((n) => {
    if (!n.empty || n.from == 0 || n.from == t.doc.length)
      return { range: n };
    let o = n.from, i = t.doc.lineAt(o), s = o == i.from ? o - 1 : te(i.text, o - i.from, !1) + i.from, l = o == i.to ? o + 1 : te(i.text, o - i.from, !0) + i.from;
    return {
      changes: { from: s, to: l, insert: t.doc.slice(o, l).append(t.doc.slice(s, o)) },
      range: d.cursor(l)
    };
  });
  return r.changes.empty ? !1 : (e(t.update(r, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function We(t) {
  let e = [], r = -1;
  for (let n of t.selection.ranges) {
    let o = t.doc.lineAt(n.from), i = t.doc.lineAt(n.to);
    if (!n.empty && n.to == i.from && (i = t.doc.lineAt(n.to - 1)), r >= o.number) {
      let s = e[e.length - 1];
      s.to = i.to, s.ranges.push(n);
    } else
      e.push({ from: o.from, to: i.to, ranges: [n] });
    r = i.number + 1;
  }
  return e;
}
function pn(t, e, r) {
  if (t.readOnly)
    return !1;
  let n = [], o = [];
  for (let i of We(t)) {
    if (r ? i.to == t.doc.length : i.from == 0)
      continue;
    let s = t.doc.lineAt(r ? i.to + 1 : i.from - 1), l = s.length + 1;
    if (r) {
      n.push({ from: i.to, to: s.to }, { from: i.from, insert: s.text + t.lineBreak });
      for (let a of i.ranges)
        o.push(d.range(Math.min(t.doc.length, a.anchor + l), Math.min(t.doc.length, a.head + l)));
    } else {
      n.push({ from: s.from, to: i.from }, { from: i.to, insert: t.lineBreak + s.text });
      for (let a of i.ranges)
        o.push(d.range(a.anchor - l, a.head - l));
    }
  }
  return n.length ? (e(t.update({
    changes: n,
    scrollIntoView: !0,
    selection: d.create(o, t.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const Ao = ({ state: t, dispatch: e }) => pn(t, e, !1), Mo = ({ state: t, dispatch: e }) => pn(t, e, !0);
function yn(t, e, r) {
  if (t.readOnly)
    return !1;
  let n = [];
  for (let o of We(t))
    r ? n.push({ from: o.from, insert: t.doc.slice(o.from, o.to) + t.lineBreak }) : n.push({ from: o.to, insert: t.lineBreak + t.doc.slice(o.from, o.to) });
  return e(t.update({ changes: n, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const Lo = ({ state: t, dispatch: e }) => yn(t, e, !1), Bo = ({ state: t, dispatch: e }) => yn(t, e, !0), Do = (t) => {
  if (t.state.readOnly)
    return !1;
  let { state: e } = t, r = e.changes(We(e).map(({ from: o, to: i }) => (o > 0 ? o-- : i < e.doc.length && i++, { from: o, to: i }))), n = oe(e.selection, (o) => t.moveVertically(o, !0)).map(r);
  return t.dispatch({ changes: r, selection: n, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function Eo(t, e) {
  if (/\(\)|\[\]|\{\}/.test(t.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let r = tt(t).resolveInner(e), n = r.childBefore(e), o = r.childAfter(e), i;
  return n && o && n.to <= e && o.from >= e && (i = n.type.prop(Ge.closedBy)) && i.indexOf(o.name) > -1 && t.doc.lineAt(n.to).from == t.doc.lineAt(o.from).from ? { from: n.to, to: o.from } : null;
}
const Ro = /* @__PURE__ */ xn(!1), wo = /* @__PURE__ */ xn(!0);
function xn(t) {
  return ({ state: e, dispatch: r }) => {
    if (e.readOnly)
      return !1;
    let n = e.changeByRange((o) => {
      let { from: i, to: s } = o, l = e.doc.lineAt(i), a = !t && i == s && Eo(e, i);
      t && (i = s = (s <= l.to ? l : e.doc.lineAt(s)).to);
      let c = new Ot(e, { simulateBreak: i, simulateDoubleBreak: !!a }), u = It(c, i);
      for (u == null && (u = /^\s*/.exec(e.doc.lineAt(i).text)[0].length); s < l.to && /\s/.test(l.text[s - l.from]); )
        s++;
      a ? { from: i, to: s } = a : i > l.from && i < l.from + 100 && !/\S/.test(l.text.slice(0, i)) && (i = l.from);
      let h = ["", Ce(e, u)];
      return a && h.push(Ce(e, c.lineIndent(l.from, -1))), {
        changes: { from: i, to: s, insert: Pt.of(h) },
        range: d.cursor(i + 1 + h[1].length)
      };
    });
    return r(e.update(n, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function it(t, e) {
  let r = -1;
  return t.changeByRange((n) => {
    let o = [];
    for (let s = n.from; s <= n.to; ) {
      let l = t.doc.lineAt(s);
      l.number > r && (n.empty || n.to > l.from) && (e(l, o, n), r = l.number), s = l.to + 1;
    }
    let i = t.changes(o);
    return {
      changes: o,
      range: d.range(i.mapPos(n.anchor, 1), i.mapPos(n.head, 1))
    };
  });
}
const To = ({ state: t, dispatch: e }) => {
  if (t.readOnly)
    return !1;
  let r = /* @__PURE__ */ Object.create(null), n = new Ot(t, { overrideIndentation: (i) => {
    let s = r[i];
    return s ?? -1;
  } }), o = it(t, (i, s, l) => {
    let a = It(n, i.from);
    if (a == null)
      return;
    /\S/.test(i.text) || (a = 0);
    let c = /^\s*/.exec(i.text)[0], u = Ce(t, a);
    (c != u || l.from < i.from + c.length) && (r[i.from] = a, s.push({ from: i.from, to: i.from + c.length, insert: u }));
  });
  return o.changes.empty || e(t.update(o, { userEvent: "indent" })), !0;
}, kn = ({ state: t, dispatch: e }) => t.readOnly ? !1 : (e(t.update(it(t, (r, n) => {
  n.push({ from: r.from, insert: t.facet(Wt) });
}), { userEvent: "input.indent" })), !0), bn = ({ state: t, dispatch: e }) => t.readOnly ? !1 : (e(t.update(it(t, (r, n) => {
  let o = /^\s*/.exec(r.text)[0];
  if (!o)
    return;
  let i = Ft(o, t.tabSize), s = 0, l = Ce(t, Math.max(0, i - $e(t)));
  for (; s < o.length && s < l.length && o.charCodeAt(s) == l.charCodeAt(s); )
    s++;
  n.push({ from: r.from + s, to: r.from + o.length, insert: l.slice(s) });
}), { userEvent: "delete.dedent" })), !0), Oo = [
  { key: "Ctrl-b", run: Jt, shift: rn, preventDefault: !0 },
  { key: "Ctrl-f", run: jt, shift: on },
  { key: "Ctrl-p", run: Zt, shift: an },
  { key: "Ctrl-n", run: Xt, shift: cn },
  { key: "Ctrl-a", run: to, shift: mo },
  { key: "Ctrl-e", run: no, shift: go },
  { key: "Ctrl-d", run: fn },
  { key: "Ctrl-h", run: Qe },
  { key: "Ctrl-k", run: gn },
  { key: "Ctrl-Alt-h", run: mn },
  { key: "Ctrl-o", run: Co },
  { key: "Ctrl-t", run: vo },
  { key: "Ctrl-v", run: je }
], Io = /* @__PURE__ */ [
  { key: "ArrowLeft", run: Jt, shift: rn, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: Gr, shift: io, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: Xr, shift: ho, preventDefault: !0 },
  { key: "ArrowRight", run: jt, shift: on, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: Kr, shift: so, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: eo, shift: fo, preventDefault: !0 },
  { key: "ArrowUp", run: Zt, shift: an, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: mt, shift: pt },
  { mac: "Ctrl-ArrowUp", run: ht, shift: ft },
  { key: "ArrowDown", run: Xt, shift: cn, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: gt, shift: yt },
  { mac: "Ctrl-ArrowDown", run: je, shift: dt },
  { key: "PageUp", run: ht, shift: ft },
  { key: "PageDown", run: je, shift: dt },
  { key: "Home", run: Zr, shift: uo, preventDefault: !0 },
  { key: "Mod-Home", run: mt, shift: pt },
  { key: "End", run: Yr, shift: co, preventDefault: !0 },
  { key: "Mod-End", run: gt, shift: yt },
  { key: "Enter", run: Ro },
  { key: "Mod-a", run: po },
  { key: "Backspace", run: Qe, shift: Qe },
  { key: "Delete", run: fn },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: mn },
  { key: "Mod-Delete", mac: "Alt-Delete", run: bo },
  { mac: "Mod-Backspace", run: So },
  { mac: "Mod-Delete", run: gn }
].concat(/* @__PURE__ */ Oo.map((t) => ({ mac: t.key, run: t.run, shift: t.shift }))), Po = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: jr, shift: lo },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: Qr, shift: ao },
  { key: "Alt-ArrowUp", run: Ao },
  { key: "Shift-Alt-ArrowUp", run: Lo },
  { key: "Alt-ArrowDown", run: Mo },
  { key: "Shift-Alt-ArrowDown", run: Bo },
  { key: "Escape", run: ko },
  { key: "Mod-Enter", run: wo },
  { key: "Alt-l", mac: "Ctrl-l", run: yo },
  { key: "Mod-i", run: xo, preventDefault: !0 },
  { key: "Mod-[", run: bn },
  { key: "Mod-]", run: kn },
  { key: "Mod-Alt-\\", run: To },
  { key: "Shift-Mod-k", run: Do },
  { key: "Shift-Mod-\\", run: oo },
  { key: "Mod-/", run: Lr },
  { key: "Alt-A", run: Dr }
].concat(Io), Wo = { key: "Tab", run: kn, shift: bn };
function g() {
  var t = arguments[0];
  typeof t == "string" && (t = document.createElement(t));
  var e = 1, r = arguments[1];
  if (r && typeof r == "object" && r.nodeType == null && !Array.isArray(r)) {
    for (var n in r)
      if (Object.prototype.hasOwnProperty.call(r, n)) {
        var o = r[n];
        typeof o == "string" ? t.setAttribute(n, o) : o != null && (t[n] = o);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    Sn(t, arguments[e]);
  return t;
}
function Sn(t, e) {
  if (typeof e == "string")
    t.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      t.appendChild(e);
    else if (Array.isArray(e))
      for (var r = 0; r < e.length; r++)
        Sn(t, e[r]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
const xt = typeof String.prototype.normalize == "function" ? (t) => t.normalize("NFKD") : (t) => t;
class ne {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, r, n = 0, o = e.length, i, s) {
    this.test = s, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(n, o), this.bufferStart = n, this.normalize = i ? (l) => i(xt(l)) : xt, this.query = this.normalize(r);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return Xn(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let r = nr(e), n = this.bufferStart + this.bufferPos;
      this.bufferPos += er(e);
      let o = this.normalize(r);
      for (let i = 0, s = n; ; i++) {
        let l = o.charCodeAt(i), a = this.match(l, s);
        if (i == o.length - 1) {
          if (a)
            return this.value = a, this;
          break;
        }
        s == n && i < r.length && r.charCodeAt(i) == l && s++;
      }
    }
  }
  match(e, r) {
    let n = null;
    for (let o = 0; o < this.matches.length; o += 2) {
      let i = this.matches[o], s = !1;
      this.query.charCodeAt(i) == e && (i == this.query.length - 1 ? n = { from: this.matches[o + 1], to: r + 1 } : (this.matches[o]++, s = !0)), s || (this.matches.splice(o, 2), o -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? n = { from: r, to: r + 1 } : this.matches.push(1, r)), n && this.test && !this.test(n.from, n.to, this.buffer, this.bufferPos) && (n = null), n;
  }
}
typeof Symbol < "u" && (ne.prototype[Symbol.iterator] = function() {
  return this;
});
const Cn = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, st = "gm" + (/x/.unicode == null ? "" : "u");
class vn {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, r, n, o = 0, i = e.length) {
    if (this.text = e, this.to = i, this.curLine = "", this.done = !1, this.value = Cn, /\\[sWDnr]|\n|\r|\[\^/.test(r))
      return new An(e, r, n, o, i);
    this.re = new RegExp(r, st + (n != null && n.ignoreCase ? "i" : "")), this.test = n == null ? void 0 : n.test, this.iter = e.iter();
    let s = e.lineAt(o);
    this.curLineStart = s.from, this.matchPos = Ae(e, o), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let r = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (r) {
        let n = this.curLineStart + r.index, o = n + r[0].length;
        if (this.matchPos = Ae(this.text, o + (n == o ? 1 : 0)), n == this.curLineStart + this.curLine.length && this.nextLine(), (n < o || n > this.value.to) && (!this.test || this.test(n, o, r)))
          return this.value = { from: n, to: o, match: r }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const Ve = /* @__PURE__ */ new WeakMap();
class ee {
  constructor(e, r) {
    this.from = e, this.text = r;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, r, n) {
    let o = Ve.get(e);
    if (!o || o.from >= n || o.to <= r) {
      let l = new ee(r, e.sliceString(r, n));
      return Ve.set(e, l), l;
    }
    if (o.from == r && o.to == n)
      return o;
    let { text: i, from: s } = o;
    return s > r && (i = e.sliceString(r, s) + i, s = r), o.to < n && (i += e.sliceString(o.to, n)), Ve.set(e, new ee(s, i)), new ee(r, i.slice(r - s, n - s));
  }
}
class An {
  constructor(e, r, n, o, i) {
    this.text = e, this.to = i, this.done = !1, this.value = Cn, this.matchPos = Ae(e, o), this.re = new RegExp(r, st + (n != null && n.ignoreCase ? "i" : "")), this.test = n == null ? void 0 : n.test, this.flat = ee.get(e, o, this.chunkEnd(
      o + 5e3
      /* Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, r = this.re.exec(this.flat.text);
      if (r && !r[0] && r.index == e && (this.re.lastIndex = e + 1, r = this.re.exec(this.flat.text)), r) {
        let n = this.flat.from + r.index, o = n + r[0].length;
        if ((this.flat.to >= this.to || r.index + r[0].length <= this.flat.text.length - 10) && (!this.test || this.test(n, o, r)))
          return this.value = { from: n, to: o, match: r }, this.matchPos = Ae(this.text, o + (n == o ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = ee.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (vn.prototype[Symbol.iterator] = An.prototype[Symbol.iterator] = function() {
  return this;
});
function Fo(t) {
  try {
    return new RegExp(t, st), !0;
  } catch {
    return !1;
  }
}
function Ae(t, e) {
  if (e >= t.length)
    return e;
  let r = t.lineAt(e), n;
  for (; e < r.to && (n = r.text.charCodeAt(e - r.from)) >= 56320 && n < 57344; )
    e++;
  return e;
}
function Ye(t) {
  let e = g("input", { class: "cm-textfield", name: "line" }), r = g("form", {
    class: "cm-gotoLine",
    onkeydown: (o) => {
      o.keyCode == 27 ? (o.preventDefault(), t.dispatch({ effects: Me.of(!1) }), t.focus()) : o.keyCode == 13 && (o.preventDefault(), n());
    },
    onsubmit: (o) => {
      o.preventDefault(), n();
    }
  }, g("label", t.state.phrase("Go to line"), ": ", e), " ", g("button", { class: "cm-button", type: "submit" }, t.state.phrase("go")));
  function n() {
    let o = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(e.value);
    if (!o)
      return;
    let { state: i } = t, s = i.doc.lineAt(i.selection.main.head), [, l, a, c, u] = o, h = c ? +c.slice(1) : 0, m = a ? +a : s.number;
    if (a && u) {
      let R = m / 100;
      l && (R = R * (l == "-" ? -1 : 1) + s.number / i.doc.lines), m = Math.round(i.doc.lines * R);
    } else
      a && l && (m = m * (l == "-" ? -1 : 1) + s.number);
    let k = i.doc.line(Math.max(1, Math.min(i.doc.lines, m))), C = d.cursor(k.from + Math.max(0, Math.min(h, k.length)));
    t.dispatch({
      effects: [Me.of(!1), p.scrollIntoView(C.from, { y: "center" })],
      selection: C
    }), t.focus();
  }
  return { dom: r };
}
const Me = /* @__PURE__ */ w.define(), kt = /* @__PURE__ */ we.define({
  create() {
    return !0;
  },
  update(t, e) {
    for (let r of e.effects)
      r.is(Me) && (t = r.value);
    return t;
  },
  provide: (t) => nt.from(t, (e) => e ? Ye : null)
}), No = (t) => {
  let e = ue(t, Ye);
  if (!e) {
    let r = [Me.of(!0)];
    t.state.field(kt, !1) == null && r.push(w.appendConfig.of([kt, qo])), t.dispatch({ effects: r }), e = ue(t, Ye);
  }
  return e && e.dom.querySelector("input").focus(), !0;
}, qo = /* @__PURE__ */ p.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), _o = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, Mn = /* @__PURE__ */ de.define({
  combine(t) {
    return Re(t, _o, {
      highlightWordAroundCursor: (e, r) => e || r,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function Ho(t) {
  let e = [Go, $o];
  return t && e.push(Mn.of(t)), e;
}
const Vo = /* @__PURE__ */ x.mark({ class: "cm-selectionMatch" }), zo = /* @__PURE__ */ x.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function bt(t, e, r, n) {
  return (r == 0 || t(e.sliceDoc(r - 1, r)) != B.Word) && (n == e.doc.length || t(e.sliceDoc(n, n + 1)) != B.Word);
}
function Uo(t, e, r, n) {
  return t(e.sliceDoc(r, r + 1)) == B.Word && t(e.sliceDoc(n - 1, n)) == B.Word;
}
const $o = /* @__PURE__ */ Nt.fromClass(class {
  constructor(t) {
    this.decorations = this.getDeco(t);
  }
  update(t) {
    (t.selectionSet || t.docChanged || t.viewportChanged) && (this.decorations = this.getDeco(t.view));
  }
  getDeco(t) {
    let e = t.state.facet(Mn), { state: r } = t, n = r.selection;
    if (n.ranges.length > 1)
      return x.none;
    let o = n.main, i, s = null;
    if (o.empty) {
      if (!e.highlightWordAroundCursor)
        return x.none;
      let a = r.wordAt(o.head);
      if (!a)
        return x.none;
      s = r.charCategorizer(o.head), i = r.sliceDoc(a.from, a.to);
    } else {
      let a = o.to - o.from;
      if (a < e.minSelectionLength || a > 200)
        return x.none;
      if (e.wholeWords) {
        if (i = r.sliceDoc(o.from, o.to), s = r.charCategorizer(o.head), !(bt(s, r, o.from, o.to) && Uo(s, r, o.from, o.to)))
          return x.none;
      } else if (i = r.sliceDoc(o.from, o.to).trim(), !i)
        return x.none;
    }
    let l = [];
    for (let a of t.visibleRanges) {
      let c = new ne(r.doc, i, a.from, a.to);
      for (; !c.next().done; ) {
        let { from: u, to: h } = c.value;
        if ((!s || bt(s, r, u, h)) && (o.empty && u <= o.from && h >= o.to ? l.push(zo.range(u, h)) : (u >= o.to || h <= o.from) && l.push(Vo.range(u, h)), l.length > e.maxMatches))
          return x.none;
      }
    }
    return x.set(l);
  }
}, {
  decorations: (t) => t.decorations
}), Go = /* @__PURE__ */ p.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), Ko = ({ state: t, dispatch: e }) => {
  let { selection: r } = t, n = d.create(r.ranges.map((o) => t.wordAt(o.head) || d.cursor(o.head)), r.mainIndex);
  return n.eq(r) ? !1 : (e(t.update({ selection: n })), !0);
};
function Jo(t, e) {
  let { main: r, ranges: n } = t.selection, o = t.wordAt(r.head), i = o && o.from == r.from && o.to == r.to;
  for (let s = !1, l = new ne(t.doc, e, n[n.length - 1].to); ; )
    if (l.next(), l.done) {
      if (s)
        return null;
      l = new ne(t.doc, e, 0, Math.max(0, n[n.length - 1].from - 1)), s = !0;
    } else {
      if (s && n.some((a) => a.from == l.value.from))
        continue;
      if (i) {
        let a = t.wordAt(l.value.from);
        if (!a || a.from != l.value.from || a.to != l.value.to)
          continue;
      }
      return l.value;
    }
}
const jo = ({ state: t, dispatch: e }) => {
  let { ranges: r } = t.selection;
  if (r.some((i) => i.from === i.to))
    return Ko({ state: t, dispatch: e });
  let n = t.sliceDoc(r[0].from, r[0].to);
  if (t.selection.ranges.some((i) => t.sliceDoc(i.from, i.to) != n))
    return !1;
  let o = Jo(t, n);
  return o ? (e(t.update({
    selection: t.selection.addRange(d.range(o.from, o.to), !1),
    effects: p.scrollIntoView(o.to)
  })), !0) : !1;
}, ie = /* @__PURE__ */ de.define({
  combine(t) {
    return Re(t, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new li(e),
      scrollToMatch: (e) => p.scrollIntoView(e)
    });
  }
});
class Ln {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || Fo(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (r, n) => n == "n" ? `
` : n == "r" ? "\r" : n == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new Xo(this) : new Yo(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, r = 0, n) {
    let o = e.doc ? e : he.create({ doc: e });
    return n == null && (n = o.doc.length), this.regexp ? Z(this, o, r, n) : Y(this, o, r, n);
  }
}
class Bn {
  constructor(e) {
    this.spec = e;
  }
}
function Y(t, e, r, n) {
  return new ne(e.doc, t.unquoted, r, n, t.caseSensitive ? void 0 : (o) => o.toLowerCase(), t.wholeWord ? Qo(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function Qo(t, e) {
  return (r, n, o, i) => ((i > r || i + o.length < n) && (i = Math.max(0, r - 2), o = t.sliceString(i, Math.min(t.length, n + 2))), (e(Le(o, r - i)) != B.Word || e(Be(o, r - i)) != B.Word) && (e(Be(o, n - i)) != B.Word || e(Le(o, n - i)) != B.Word));
}
class Yo extends Bn {
  constructor(e) {
    super(e);
  }
  nextMatch(e, r, n) {
    let o = Y(this.spec, e, n, e.doc.length).nextOverlapping();
    return o.done && (o = Y(this.spec, e, 0, r).nextOverlapping()), o.done ? null : o.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, r, n) {
    for (let o = n; ; ) {
      let i = Math.max(r, o - 1e4 - this.spec.unquoted.length), s = Y(this.spec, e, i, o), l = null;
      for (; !s.nextOverlapping().done; )
        l = s.value;
      if (l)
        return l;
      if (i == r)
        return null;
      o -= 1e4;
    }
  }
  prevMatch(e, r, n) {
    return this.prevMatchInRange(e, 0, r) || this.prevMatchInRange(e, n, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, r) {
    let n = Y(this.spec, e, 0, e.doc.length), o = [];
    for (; !n.next().done; ) {
      if (o.length >= r)
        return null;
      o.push(n.value);
    }
    return o;
  }
  highlight(e, r, n, o) {
    let i = Y(this.spec, e, Math.max(0, r - this.spec.unquoted.length), Math.min(n + this.spec.unquoted.length, e.doc.length));
    for (; !i.next().done; )
      o(i.value.from, i.value.to);
  }
}
function Z(t, e, r, n) {
  return new vn(e.doc, t.search, {
    ignoreCase: !t.caseSensitive,
    test: t.wholeWord ? Zo(e.charCategorizer(e.selection.main.head)) : void 0
  }, r, n);
}
function Le(t, e) {
  return t.slice(te(t, e, !1), e);
}
function Be(t, e) {
  return t.slice(e, te(t, e));
}
function Zo(t) {
  return (e, r, n) => !n[0].length || (t(Le(n.input, n.index)) != B.Word || t(Be(n.input, n.index)) != B.Word) && (t(Be(n.input, n.index + n[0].length)) != B.Word || t(Le(n.input, n.index + n[0].length)) != B.Word);
}
class Xo extends Bn {
  nextMatch(e, r, n) {
    let o = Z(this.spec, e, n, e.doc.length).next();
    return o.done && (o = Z(this.spec, e, 0, r).next()), o.done ? null : o.value;
  }
  prevMatchInRange(e, r, n) {
    for (let o = 1; ; o++) {
      let i = Math.max(
        r,
        n - o * 1e4
        /* ChunkSize */
      ), s = Z(this.spec, e, i, n), l = null;
      for (; !s.next().done; )
        l = s.value;
      if (l && (i == r || l.from > i + 10))
        return l;
      if (i == r)
        return null;
    }
  }
  prevMatch(e, r, n) {
    return this.prevMatchInRange(e, 0, r) || this.prevMatchInRange(e, n, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace.replace(/\$([$&\d+])/g, (r, n) => n == "$" ? "$" : n == "&" ? e.match[0] : n != "0" && +n < e.match.length ? e.match[n] : r));
  }
  matchAll(e, r) {
    let n = Z(this.spec, e, 0, e.doc.length), o = [];
    for (; !n.next().done; ) {
      if (o.length >= r)
        return null;
      o.push(n.value);
    }
    return o;
  }
  highlight(e, r, n, o) {
    let i = Z(this.spec, e, Math.max(
      0,
      r - 250
      /* HighlightMargin */
    ), Math.min(n + 250, e.doc.length));
    for (; !i.next().done; )
      o(i.value.from, i.value.to);
  }
}
const fe = /* @__PURE__ */ w.define(), lt = /* @__PURE__ */ w.define(), q = /* @__PURE__ */ we.define({
  create(t) {
    return new ze(Ze(t).create(), null);
  },
  update(t, e) {
    for (let r of e.effects)
      r.is(fe) ? t = new ze(r.value.create(), t.panel) : r.is(lt) && (t = new ze(t.query, r.value ? at : null));
    return t;
  },
  provide: (t) => nt.from(t, (e) => e.panel)
});
class ze {
  constructor(e, r) {
    this.query = e, this.panel = r;
  }
}
const ei = /* @__PURE__ */ x.mark({ class: "cm-searchMatch" }), ti = /* @__PURE__ */ x.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), ni = /* @__PURE__ */ Nt.fromClass(class {
  constructor(t) {
    this.view = t, this.decorations = this.highlight(t.state.field(q));
  }
  update(t) {
    let e = t.state.field(q);
    (e != t.startState.field(q) || t.docChanged || t.selectionSet || t.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: t, panel: e }) {
    if (!e || !t.spec.valid)
      return x.none;
    let { view: r } = this, n = new rr();
    for (let o = 0, i = r.visibleRanges, s = i.length; o < s; o++) {
      let { from: l, to: a } = i[o];
      for (; o < s - 1 && a > i[o + 1].from - 2 * 250; )
        a = i[++o].to;
      t.highlight(r.state, l, a, (c, u) => {
        let h = r.state.selection.ranges.some((m) => m.from == c && m.to == u);
        n.add(c, u, h ? ti : ei);
      });
    }
    return n.finish();
  }
}, {
  decorations: (t) => t.decorations
});
function me(t) {
  return (e) => {
    let r = e.state.field(q, !1);
    return r && r.query.spec.valid ? t(e, r) : Rn(e);
  };
}
const De = /* @__PURE__ */ me((t, { query: e }) => {
  let { to: r } = t.state.selection.main, n = e.nextMatch(t.state, r, r);
  if (!n)
    return !1;
  let o = d.single(n.from, n.to), i = t.state.facet(ie);
  return t.dispatch({
    selection: o,
    effects: [ct(t, n), i.scrollToMatch(o.main, t)],
    userEvent: "select.search"
  }), En(t), !0;
}), Ee = /* @__PURE__ */ me((t, { query: e }) => {
  let { state: r } = t, { from: n } = r.selection.main, o = e.prevMatch(r, n, n);
  if (!o)
    return !1;
  let i = d.single(o.from, o.to), s = t.state.facet(ie);
  return t.dispatch({
    selection: i,
    effects: [ct(t, o), s.scrollToMatch(i.main, t)],
    userEvent: "select.search"
  }), En(t), !0;
}), ri = /* @__PURE__ */ me((t, { query: e }) => {
  let r = e.matchAll(t.state, 1e3);
  return !r || !r.length ? !1 : (t.dispatch({
    selection: d.create(r.map((n) => d.range(n.from, n.to))),
    userEvent: "select.search.matches"
  }), !0);
}), oi = ({ state: t, dispatch: e }) => {
  let r = t.selection;
  if (r.ranges.length > 1 || r.main.empty)
    return !1;
  let { from: n, to: o } = r.main, i = [], s = 0;
  for (let l = new ne(t.doc, t.sliceDoc(n, o)); !l.next().done; ) {
    if (i.length > 1e3)
      return !1;
    l.value.from == n && (s = i.length), i.push(d.range(l.value.from, l.value.to));
  }
  return e(t.update({
    selection: d.create(i, s),
    userEvent: "select.search.matches"
  })), !0;
}, St = /* @__PURE__ */ me((t, { query: e }) => {
  let { state: r } = t, { from: n, to: o } = r.selection.main;
  if (r.readOnly)
    return !1;
  let i = e.nextMatch(r, n, n);
  if (!i)
    return !1;
  let s = [], l, a, c = [];
  if (i.from == n && i.to == o && (a = r.toText(e.getReplacement(i)), s.push({ from: i.from, to: i.to, insert: a }), i = e.nextMatch(r, i.from, i.to), c.push(p.announce.of(r.phrase("replaced match on line $", r.doc.lineAt(n).number) + "."))), i) {
    let u = s.length == 0 || s[0].from >= i.to ? 0 : i.to - i.from - a.length;
    l = d.single(i.from - u, i.to - u), c.push(ct(t, i)), c.push(r.facet(ie).scrollToMatch(l.main, t));
  }
  return t.dispatch({
    changes: s,
    selection: l,
    effects: c,
    userEvent: "input.replace"
  }), !0;
}), ii = /* @__PURE__ */ me((t, { query: e }) => {
  if (t.state.readOnly)
    return !1;
  let r = e.matchAll(t.state, 1e9).map((o) => {
    let { from: i, to: s } = o;
    return { from: i, to: s, insert: e.getReplacement(o) };
  });
  if (!r.length)
    return !1;
  let n = t.state.phrase("replaced $ matches", r.length) + ".";
  return t.dispatch({
    changes: r,
    effects: p.announce.of(n),
    userEvent: "input.replace.all"
  }), !0;
});
function at(t) {
  return t.state.facet(ie).createPanel(t);
}
function Ze(t, e) {
  var r, n, o, i, s;
  let l = t.selection.main, a = l.empty || l.to > l.from + 100 ? "" : t.sliceDoc(l.from, l.to);
  if (e && !a)
    return e;
  let c = t.facet(ie);
  return new Ln({
    search: ((r = e == null ? void 0 : e.literal) !== null && r !== void 0 ? r : c.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (n = e == null ? void 0 : e.caseSensitive) !== null && n !== void 0 ? n : c.caseSensitive,
    literal: (o = e == null ? void 0 : e.literal) !== null && o !== void 0 ? o : c.literal,
    regexp: (i = e == null ? void 0 : e.regexp) !== null && i !== void 0 ? i : c.regexp,
    wholeWord: (s = e == null ? void 0 : e.wholeWord) !== null && s !== void 0 ? s : c.wholeWord
  });
}
function Dn(t) {
  let e = ue(t, at);
  return e && e.dom.querySelector("[main-field]");
}
function En(t) {
  let e = Dn(t);
  e && e == t.root.activeElement && e.select();
}
const Rn = (t) => {
  let e = t.state.field(q, !1);
  if (e && e.panel) {
    let r = Dn(t);
    if (r && r != t.root.activeElement) {
      let n = Ze(t.state, e.query.spec);
      n.valid && t.dispatch({ effects: fe.of(n) }), r.focus(), r.select();
    }
  } else
    t.dispatch({ effects: [
      lt.of(!0),
      e ? fe.of(Ze(t.state, e.query.spec)) : w.appendConfig.of(ci)
    ] });
  return !0;
}, wn = (t) => {
  let e = t.state.field(q, !1);
  if (!e || !e.panel)
    return !1;
  let r = ue(t, at);
  return r && r.dom.contains(t.root.activeElement) && t.focus(), t.dispatch({ effects: lt.of(!1) }), !0;
}, si = [
  { key: "Mod-f", run: Rn, scope: "editor search-panel" },
  { key: "F3", run: De, shift: Ee, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: De, shift: Ee, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: wn, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: oi },
  { key: "Alt-g", run: No },
  { key: "Mod-d", run: jo, preventDefault: !0 }
];
class li {
  constructor(e) {
    this.view = e;
    let r = this.query = e.state.field(q).query.spec;
    this.commit = this.commit.bind(this), this.searchField = g("input", {
      value: r.search,
      placeholder: M(e, "Find"),
      "aria-label": M(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = g("input", {
      value: r.replace,
      placeholder: M(e, "Replace"),
      "aria-label": M(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = g("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: r.caseSensitive,
      onchange: this.commit
    }), this.reField = g("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: r.regexp,
      onchange: this.commit
    }), this.wordField = g("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: r.wholeWord,
      onchange: this.commit
    });
    function n(o, i, s) {
      return g("button", { class: "cm-button", name: o, onclick: i, type: "button" }, s);
    }
    this.dom = g("div", { onkeydown: (o) => this.keydown(o), class: "cm-search" }, [
      this.searchField,
      n("next", () => De(e), [M(e, "next")]),
      n("prev", () => Ee(e), [M(e, "previous")]),
      n("select", () => ri(e), [M(e, "all")]),
      g("label", null, [this.caseField, M(e, "match case")]),
      g("label", null, [this.reField, M(e, "regexp")]),
      g("label", null, [this.wordField, M(e, "by word")]),
      ...e.state.readOnly ? [] : [
        g("br"),
        this.replaceField,
        n("replace", () => St(e), [M(e, "replace")]),
        n("replaceAll", () => ii(e), [M(e, "replace all")])
      ],
      g("button", {
        name: "close",
        onclick: () => wn(e),
        "aria-label": M(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new Ln({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: fe.of(e) }));
  }
  keydown(e) {
    or(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? Ee : De)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), St(this.view));
  }
  update(e) {
    for (let r of e.transactions)
      for (let n of r.effects)
        n.is(fe) && !n.value.eq(this.query) && this.setQuery(n.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(ie).top;
  }
}
function M(t, e) {
  return t.state.phrase(e);
}
const xe = 30, ke = /[\s\.,:;?!]/;
function ct(t, { from: e, to: r }) {
  let n = t.state.doc.lineAt(e), o = t.state.doc.lineAt(r).to, i = Math.max(n.from, e - xe), s = Math.min(o, r + xe), l = t.state.sliceDoc(i, s);
  if (i != n.from) {
    for (let a = 0; a < xe; a++)
      if (!ke.test(l[a + 1]) && ke.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (s != o) {
    for (let a = l.length - 1; a > l.length - xe; a--)
      if (!ke.test(l[a - 1]) && ke.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return p.announce.of(`${t.state.phrase("current match")}. ${l} ${t.state.phrase("on line")} ${n.number}.`);
}
const ai = /* @__PURE__ */ p.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), ci = [
  q,
  /* @__PURE__ */ tr.lowest(ni),
  ai
];
class ui {
  constructor(e, r, n) {
    this.from = e, this.to = r, this.diagnostic = n;
  }
}
class U {
  constructor(e, r, n) {
    this.diagnostics = e, this.panel = r, this.selected = n;
  }
  static init(e, r, n) {
    let o = e, i = n.facet(In).markerFilter;
    i && (o = i(o));
    let s = x.set(o.map((l) => l.from == l.to || l.from == l.to - 1 && n.doc.lineAt(l.from).to == l.from ? x.widget({
      widget: new ki(l),
      diagnostic: l
    }).range(l.from) : x.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + l.severity + (l.markClass ? " " + l.markClass : "") },
      diagnostic: l
    }).range(l.from, l.to)), !0);
    return new U(s, r, re(s));
  }
}
function re(t, e = null, r = 0) {
  let n = null;
  return t.between(r, 1e9, (o, i, { spec: s }) => {
    if (!(e && s.diagnostic != e))
      return n = new ui(o, i, s.diagnostic), !1;
  }), n;
}
function hi(t, e) {
  let r = t.startState.doc.lineAt(e.pos);
  return !!(t.effects.some((n) => n.is(Tn)) || t.changes.touchesRange(r.from, r.to));
}
function fi(t, e) {
  return t.field(L, !1) ? e : e.concat(w.appendConfig.of(Ci));
}
const Tn = /* @__PURE__ */ w.define(), ut = /* @__PURE__ */ w.define(), On = /* @__PURE__ */ w.define(), L = /* @__PURE__ */ we.define({
  create() {
    return new U(x.none, null, null);
  },
  update(t, e) {
    if (e.docChanged) {
      let r = t.diagnostics.map(e.changes), n = null;
      if (t.selected) {
        let o = e.changes.mapPos(t.selected.from, 1);
        n = re(r, t.selected.diagnostic, o) || re(r, null, o);
      }
      t = new U(r, t.panel, n);
    }
    for (let r of e.effects)
      r.is(Tn) ? t = U.init(r.value, t.panel, e.state) : r.is(ut) ? t = new U(t.diagnostics, r.value ? Fe.open : null, t.selected) : r.is(On) && (t = new U(t.diagnostics, t.panel, r.value));
    return t;
  },
  provide: (t) => [
    nt.from(t, (e) => e.panel),
    p.decorations.from(t, (e) => e.diagnostics)
  ]
}), di = /* @__PURE__ */ x.mark({ class: "cm-lintRange cm-lintRange-active" });
function mi(t, e, r) {
  let { diagnostics: n } = t.state.field(L), o = [], i = 2e8, s = 0;
  n.between(e - (r < 0 ? 1 : 0), e + (r > 0 ? 1 : 0), (a, c, { spec: u }) => {
    e >= a && e <= c && (a == c || (e > a || r > 0) && (e < c || r < 0)) && (o.push(u.diagnostic), i = Math.min(a, i), s = Math.max(c, s));
  });
  let l = t.state.facet(In).tooltipFilter;
  return l && (o = l(o)), o.length ? {
    pos: i,
    end: s,
    above: t.state.doc.lineAt(i).to < s,
    create() {
      return { dom: gi(t, o) };
    }
  } : null;
}
function gi(t, e) {
  return g("ul", { class: "cm-tooltip-lint" }, e.map((r) => Wn(t, r, !1)));
}
const pi = (t) => {
  let e = t.state.field(L, !1);
  (!e || !e.panel) && t.dispatch({ effects: fi(t.state, [ut.of(!0)]) });
  let r = ue(t, Fe.open);
  return r && r.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, Ct = (t) => {
  let e = t.state.field(L, !1);
  return !e || !e.panel ? !1 : (t.dispatch({ effects: ut.of(!1) }), !0);
}, yi = (t) => {
  let e = t.state.field(L, !1);
  if (!e)
    return !1;
  let r = t.state.selection.main, n = e.diagnostics.iter(r.to + 1);
  return !n.value && (n = e.diagnostics.iter(0), !n.value || n.from == r.from && n.to == r.to) ? !1 : (t.dispatch({ selection: { anchor: n.from, head: n.to }, scrollIntoView: !0 }), !0);
}, xi = [
  { key: "Mod-Shift-m", run: pi, preventDefault: !0 },
  { key: "F8", run: yi }
], In = /* @__PURE__ */ de.define({
  combine(t) {
    return Object.assign({ sources: t.map((e) => e.source) }, Re(t.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null
    }, {
      needsRefresh: (e, r) => e ? r ? (n) => e(n) || r(n) : e : r
    }));
  }
});
function Pn(t) {
  let e = [];
  if (t)
    e:
      for (let { name: r } of t) {
        for (let n = 0; n < r.length; n++) {
          let o = r[n];
          if (/[a-zA-Z]/.test(o) && !e.some((i) => i.toLowerCase() == o.toLowerCase())) {
            e.push(o);
            continue e;
          }
        }
        e.push("");
      }
  return e;
}
function Wn(t, e, r) {
  var n;
  let o = r ? Pn(e.actions) : [];
  return g("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, g("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage() : e.message), (n = e.actions) === null || n === void 0 ? void 0 : n.map((i, s) => {
    let l = !1, a = (m) => {
      if (m.preventDefault(), l)
        return;
      l = !0;
      let k = re(t.state.field(L).diagnostics, e);
      k && i.apply(t, k.from, k.to);
    }, { name: c } = i, u = o[s] ? c.indexOf(o[s]) : -1, h = u < 0 ? c : [
      c.slice(0, u),
      g("u", c.slice(u, u + 1)),
      c.slice(u + 1)
    ];
    return g("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${c}${u < 0 ? "" : ` (access key "${o[s]})"`}.`
    }, h);
  }), e.source && g("div", { class: "cm-diagnosticSource" }, e.source));
}
class ki extends sr {
  constructor(e) {
    super(), this.diagnostic = e;
  }
  eq(e) {
    return e.diagnostic == this.diagnostic;
  }
  toDOM() {
    return g("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class vt {
  constructor(e, r) {
    this.diagnostic = r, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = Wn(e, r, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Fe {
  constructor(e) {
    this.view = e, this.items = [];
    let r = (o) => {
      if (o.keyCode == 27)
        Ct(this.view), this.view.focus();
      else if (o.keyCode == 38 || o.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (o.keyCode == 40 || o.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (o.keyCode == 36)
        this.moveSelection(0);
      else if (o.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (o.keyCode == 13)
        this.view.focus();
      else if (o.keyCode >= 65 && o.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: i } = this.items[this.selectedIndex], s = Pn(i.actions);
        for (let l = 0; l < s.length; l++)
          if (s[l].toUpperCase().charCodeAt(0) == o.keyCode) {
            let a = re(this.view.state.field(L).diagnostics, i);
            a && i.actions[l].apply(e, a.from, a.to);
          }
      } else
        return;
      o.preventDefault();
    }, n = (o) => {
      for (let i = 0; i < this.items.length; i++)
        this.items[i].dom.contains(o.target) && this.moveSelection(i);
    };
    this.list = g("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: r,
      onclick: n
    }), this.dom = g("div", { class: "cm-panel-lint" }, this.list, g("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => Ct(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(L).selected;
    if (!e)
      return -1;
    for (let r = 0; r < this.items.length; r++)
      if (this.items[r].diagnostic == e.diagnostic)
        return r;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: r } = this.view.state.field(L), n = 0, o = !1, i = null;
    for (e.between(0, this.view.state.doc.length, (s, l, { spec: a }) => {
      let c = -1, u;
      for (let h = n; h < this.items.length; h++)
        if (this.items[h].diagnostic == a.diagnostic) {
          c = h;
          break;
        }
      c < 0 ? (u = new vt(this.view, a.diagnostic), this.items.splice(n, 0, u), o = !0) : (u = this.items[c], c > n && (this.items.splice(n, c - n), o = !0)), r && u.diagnostic == r.diagnostic ? u.dom.hasAttribute("aria-selected") || (u.dom.setAttribute("aria-selected", "true"), i = u) : u.dom.hasAttribute("aria-selected") && u.dom.removeAttribute("aria-selected"), n++;
    }); n < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      o = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new vt(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), o = !0), i ? (this.list.setAttribute("aria-activedescendant", i.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: i.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: s, panel: l }) => {
        s.top < l.top ? this.list.scrollTop -= l.top - s.top : s.bottom > l.bottom && (this.list.scrollTop += s.bottom - l.bottom);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), o && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function r() {
      let n = e;
      e = n.nextSibling, n.remove();
    }
    for (let n of this.items)
      if (n.dom.parentNode == this.list) {
        for (; e != n.dom; )
          r();
        e = n.dom.nextSibling;
      } else
        this.list.insertBefore(n.dom, e);
    for (; e; )
      r();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let r = this.view.state.field(L), n = re(r.diagnostics, this.items[e].diagnostic);
    n && this.view.dispatch({
      selection: { anchor: n.from, head: n.to },
      scrollIntoView: !0,
      effects: On.of(n)
    });
  }
  static open(e) {
    return new Fe(e);
  }
}
function bi(t, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(t)}</svg>')`;
}
function be(t) {
  return bi(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${t}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const Si = /* @__PURE__ */ p.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ be("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ be("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ be("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ be("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
}), Ci = [
  L,
  /* @__PURE__ */ p.decorations.compute([L], (t) => {
    let { selected: e, panel: r } = t.field(L);
    return !e || !r || e.from == e.to ? x.none : x.set([
      di.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ ir(mi, { hideOn: hi }),
  Si
];
var At = function(e) {
  e === void 0 && (e = {});
  var {
    crosshairCursor: r = !1
  } = e, n = [];
  e.closeBracketsKeymap !== !1 && (n = n.concat(lr)), e.defaultKeymap !== !1 && (n = n.concat(Po)), e.searchKeymap !== !1 && (n = n.concat(si)), e.historyKeymap !== !1 && (n = n.concat($r)), e.foldKeymap !== !1 && (n = n.concat(ar)), e.completionKeymap !== !1 && (n = n.concat(cr)), e.lintKeymap !== !1 && (n = n.concat(xi));
  var o = [];
  return e.lineNumbers !== !1 && o.push(ur()), e.highlightActiveLineGutter !== !1 && o.push(hr()), e.highlightSpecialChars !== !1 && o.push(fr()), e.history !== !1 && o.push(Wr()), e.foldGutter !== !1 && o.push(dr()), e.drawSelection !== !1 && o.push(mr()), e.dropCursor !== !1 && o.push(gr()), e.allowMultipleSelections !== !1 && o.push(he.allowMultipleSelections.of(!0)), e.indentOnInput !== !1 && o.push(pr()), e.syntaxHighlighting !== !1 && o.push(qt(vr, {
    fallback: !0
  })), e.bracketMatching !== !1 && o.push(yr()), e.closeBrackets !== !1 && o.push(xr()), e.autocompletion !== !1 && o.push(kr()), e.rectangularSelection !== !1 && o.push(br()), r !== !1 && o.push(Sr()), e.highlightActiveLine !== !1 && o.push(Cr()), e.highlightSelectionMatches !== !1 && o.push(Ho()), e.tabSize && typeof e.tabSize == "number" && o.push(Wt.of(" ".repeat(e.tabSize))), o.concat([_t.of(n.flat())]).filter(Boolean);
};
const vi = "#e5c07b", Mt = "#e06c75", Ai = "#56b6c2", Mi = "#ffffff", Se = "#abb2bf", Xe = "#7d8799", Li = "#61afef", Bi = "#98c379", Lt = "#d19a66", Di = "#c678dd", Ei = "#21252b", Bt = "#2c313a", Dt = "#282c34", Ue = "#353a42", Ri = "#3E4451", Et = "#528bff", wi = /* @__PURE__ */ p.theme({
  "&": {
    color: Se,
    backgroundColor: Dt
  },
  ".cm-content": {
    caretColor: Et
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: Et },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: Ri },
  ".cm-panels": { backgroundColor: Ei, color: Se },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847"
  },
  ".cm-gutters": {
    backgroundColor: Dt,
    color: Xe,
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: Bt
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: Ue
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: Ue,
    borderBottomColor: Ue
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: Bt,
      color: Se
    }
  }
}, { dark: !0 }), Ti = /* @__PURE__ */ Ar.define([
  {
    tag: f.keyword,
    color: Di
  },
  {
    tag: [f.name, f.deleted, f.character, f.propertyName, f.macroName],
    color: Mt
  },
  {
    tag: [/* @__PURE__ */ f.function(f.variableName), f.labelName],
    color: Li
  },
  {
    tag: [f.color, /* @__PURE__ */ f.constant(f.name), /* @__PURE__ */ f.standard(f.name)],
    color: Lt
  },
  {
    tag: [/* @__PURE__ */ f.definition(f.name), f.separator],
    color: Se
  },
  {
    tag: [f.typeName, f.className, f.number, f.changed, f.annotation, f.modifier, f.self, f.namespace],
    color: vi
  },
  {
    tag: [f.operator, f.operatorKeyword, f.url, f.escape, f.regexp, f.link, /* @__PURE__ */ f.special(f.string)],
    color: Ai
  },
  {
    tag: [f.meta, f.comment],
    color: Xe
  },
  {
    tag: f.strong,
    fontWeight: "bold"
  },
  {
    tag: f.emphasis,
    fontStyle: "italic"
  },
  {
    tag: f.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: f.link,
    color: Xe,
    textDecoration: "underline"
  },
  {
    tag: f.heading,
    fontWeight: "bold",
    color: Mt
  },
  {
    tag: [f.atom, f.bool, /* @__PURE__ */ f.special(f.variableName)],
    color: Lt
  },
  {
    tag: [f.processingInstruction, f.string, f.inserted],
    color: Bi
  },
  {
    tag: f.invalid,
    color: Mi
  }
]), Oi = [wi, /* @__PURE__ */ qt(Ti)];
var Ii = p.theme({
  "&": {
    backgroundColor: "#fff"
  }
}, {
  dark: !1
}), Pi = function(e) {
  e === void 0 && (e = {});
  var {
    indentWithTab: r = !0,
    editable: n = !0,
    readOnly: o = !1,
    theme: i = "light",
    placeholder: s = "",
    basicSetup: l = !0
  } = e, a = [];
  switch (r && a.unshift(_t.of([Wo])), l && (typeof l == "boolean" ? a.unshift(At()) : a.unshift(At(l))), s && a.unshift(Mr(s)), i) {
    case "light":
      a.push(Ii);
      break;
    case "dark":
      a.push(Oi);
      break;
    case "none":
      break;
    default:
      a.push(i);
      break;
  }
  return n === !1 && a.push(p.editable.of(!1)), o && a.push(he.readOnly.of(!0)), [...a];
}, Wi = (t) => ({
  line: t.state.doc.lineAt(t.state.selection.main.from),
  lineCount: t.state.doc.lines,
  lineBreak: t.state.lineBreak,
  length: t.state.doc.length,
  readOnly: t.state.readOnly,
  tabSize: t.state.tabSize,
  selection: t.state.selection,
  selectionAsSingle: t.state.selection.asSingle().main,
  ranges: t.state.selection.ranges,
  selectionCode: t.state.sliceDoc(t.state.selection.main.from, t.state.selection.main.to),
  selections: t.state.selection.ranges.map((e) => t.state.sliceDoc(e.from, e.to)),
  selectedText: t.state.selection.ranges.some((e) => !e.empty)
}), Rt = et.define(), Fi = [];
function Ni(t) {
  var {
    value: e,
    selection: r,
    onChange: n,
    onStatistics: o,
    onCreateEditor: i,
    onUpdate: s,
    extensions: l = Fi,
    autoFocus: a,
    theme: c = "light",
    height: u = null,
    minHeight: h = null,
    maxHeight: m = null,
    width: k = null,
    minWidth: C = null,
    maxWidth: R = null,
    placeholder: $ = "",
    editable: G = !0,
    readOnly: H = !1,
    indentWithTab: K = !0,
    basicSetup: J = !0,
    root: se,
    initialState: P
  } = t, [W, j] = ce(), [y, b] = ce(), [F, Q] = ce(), Ne = p.theme({
    "&": {
      height: u,
      minHeight: h,
      maxHeight: m,
      width: k,
      minWidth: C,
      maxWidth: R
    },
    "& .cm-scroller": {
      height: "100% !important"
    }
  }), ge = p.updateListener.of((v) => {
    if (v.docChanged && typeof n == "function" && // Fix echoing of the remote changes:
    // If transaction is market as remote we don't have to call `onChange` handler again
    !v.transactions.some((Nn) => Nn.annotation(Rt))) {
      var le = v.state.doc, pe = le.toString();
      n(pe, v);
    }
    o && o(Wi(v));
  }), qe = Pi({
    theme: c,
    editable: G,
    readOnly: H,
    placeholder: $,
    indentWithTab: K,
    basicSetup: J
  }), V = [ge, Ne, ...qe];
  return s && typeof s == "function" && V.push(p.updateListener.of(s)), V = V.concat(l), qn(() => {
    if (W && !F) {
      var v = {
        doc: e,
        selection: r,
        extensions: V
      }, le = P ? he.fromJSON(P.json, v, P.fields) : he.create(v);
      if (Q(le), !y) {
        var pe = new p({
          state: le,
          parent: W,
          root: se
        });
        b(pe), i && i(pe, le);
      }
    }
    return () => {
      y && (Q(void 0), b(void 0));
    };
  }, [W, F]), z(() => {
    t.container && j(t.container);
  }, [t.container]), z(() => () => {
    y && (y.destroy(), b(void 0));
  }, [y]), z(() => {
    a && y && y.focus();
  }, [a, y]), z(() => {
    y && y.dispatch({
      effects: w.reconfigure.of(V)
    });
  }, [c, l, u, h, m, k, C, R, $, G, H, K, J, n, s]), z(() => {
    if (e !== void 0) {
      var v = y ? y.state.doc.toString() : "";
      y && e !== v && y.dispatch({
        changes: {
          from: 0,
          to: v.length,
          insert: e || ""
        },
        annotations: [Rt.of(!0)]
      });
    }
  }, [e, y]), {
    state: F,
    setState: Q,
    view: y,
    setView: b,
    container: W,
    setContainer: j
  };
}
var qi = ["className", "value", "selection", "extensions", "onChange", "onStatistics", "onCreateEditor", "onUpdate", "autoFocus", "theme", "height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "basicSetup", "placeholder", "indentWithTab", "editable", "readOnly", "root", "initialState"], Fn = /* @__PURE__ */ wt((t, e) => {
  var {
    className: r,
    value: n = "",
    selection: o,
    extensions: i = [],
    onChange: s,
    onStatistics: l,
    onCreateEditor: a,
    onUpdate: c,
    autoFocus: u,
    theme: h = "light",
    height: m,
    minHeight: k,
    maxHeight: C,
    width: R,
    minWidth: $,
    maxWidth: G,
    basicSetup: H,
    placeholder: K,
    indentWithTab: J,
    editable: se,
    readOnly: P,
    root: W,
    initialState: j
  } = t, y = _n(t, qi), b = Tt(null), {
    state: F,
    view: Q,
    container: Ne,
    setContainer: ge
  } = Ni({
    root: W,
    value: n,
    autoFocus: u,
    theme: h,
    height: m,
    minHeight: k,
    maxHeight: C,
    width: R,
    minWidth: $,
    maxWidth: G,
    basicSetup: H,
    placeholder: K,
    indentWithTab: J,
    editable: se,
    readOnly: P,
    selection: o,
    onChange: s,
    onStatistics: l,
    onCreateEditor: a,
    onUpdate: c,
    extensions: i,
    initialState: j
  });
  Hn(e, () => ({
    editor: b.current,
    state: F,
    view: Q
  }), [b, Ne, F, Q]);
  var qe = Vn((v) => {
    b.current = v, ge(v);
  }, [ge]);
  if (typeof n != "string")
    throw new Error("value must be typeof string but got " + typeof n);
  var V = typeof h == "string" ? "cm-theme-" + h : "cm-theme";
  return /* @__PURE__ */ N.jsx("div", zn({
    ref: qe,
    className: "" + V + (r ? " " + r : "")
  }, y));
});
Fn.displayName = "CodeMirror";
const _i = [
  "[&_.cm-editor]:bg-transparent",
  "[&_.cm-editor]:border-transparent",
  "[&_.cm-scroller]:font-mono",
  "[&_.cm-scroller]:border-transparent",
  "[&_.cm-activeLine]:bg-transparent",
  "[&_.cm-activeLineGutter]:bg-transparent",
  "[&_.cm-gutters]:bg-grey-75 dark:[&_.cm-gutters]:bg-grey-950",
  "[&_.cm-gutters]:text-grey-600 dark:[&_.cm-gutters]:text-grey-500",
  "[&_.cm-gutters]:border-grey-500 dark:[&_.cm-gutters]:border-grey-800",
  "[&_.cm-cursor]:border-grey-900 dark:[&_.cm-cursor]:border-grey-75",
  "dark:[&_.cm-tooltip-autocomplete.cm-tooltip_ul_li:not([aria-selected])]:bg-grey-975"
].join(" "), zi = wt(function({
  title: e,
  value: r,
  height: n = "200px",
  error: o,
  hint: i,
  clearBg: s = !0,
  extensions: l,
  onChange: a,
  onFocus: c,
  onBlur: u,
  className: h,
  ...m
}, k) {
  const C = Un(), R = Tt(null), [$, G] = ce(100), [H, K] = $n.useState(null), [J, se] = ce({
    crosshairCursor: !1
  }), { setFocusState: P } = Gn(), W = (b) => {
    c == null || c(b), P(!0);
  }, j = (b) => {
    u == null || u(b), P(!1);
  };
  z(() => {
    Promise.all(l).then(K), se((b) => ({ setup: b, searchKeymap: !1 }));
  }, [l]), z(() => {
    const b = new ResizeObserver(([F]) => {
      G(F.contentRect.width);
    });
    return b.observe(R.current), () => b.disconnect();
  }, []);
  const y = Kn(
    "peer order-2 w-full max-w-full overflow-hidden rounded-sm border",
    s ? "bg-transparent" : "bg-grey-75",
    o ? "border-red" : "border-grey-500 dark:border-grey-800",
    e && "mt-2",
    n === "full" && "h-full",
    _i,
    h
  );
  return /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
    /* @__PURE__ */ N.jsx("div", { ref: R }),
    H && /* @__PURE__ */ N.jsxs("div", { className: n === "full" ? "h-full" : "", style: { width: $ }, children: [
      /* @__PURE__ */ N.jsx(
        Fn,
        {
          ref: k,
          basicSetup: J,
          className: y,
          extensions: H,
          height: n === "full" ? "100%" : n,
          value: r,
          onBlur: j,
          onChange: a,
          onFocus: W,
          ...m
        }
      ),
      e && /* @__PURE__ */ N.jsx(Jn, { className: "order-1 !text-grey-700 peer-focus:!text-black", htmlFor: C, useLabelTag: !0, children: e }),
      i && /* @__PURE__ */ N.jsx(jn, { className: "order-3", color: o ? "red" : "", children: i })
    ] })
  ] });
});
export {
  zi as default
};
//# sourceMappingURL=CodeEditorView-03f7aa4d.mjs.map
