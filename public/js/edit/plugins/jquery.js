(function() {
  (function(b, a, c) {
    b.fn.jScrollPane = function(e) {
      var d;
      d = function(D, O) {
        var A, B, C, E, F, G, H, I, J, K, L, M, N, P, Q, R, S, T, U, V, W, X, Y, Z, aA, aB, aC, aD, aE, aF, aG, aH, aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, an, ao, ap, aq, ar, at, au, av, aw, ax, ay, az, f, g, h, i, j, k, l, m, n, o, p, q, r, t, u, v, w, x, y, z;
        ar = function(aQ) {
          var L, T, Y, Z, aE, aI, aJ, aK, aL, aM, aN, aO, aP, aj, al, av, ay, az, q, v, y;
          aL = void 0;
          aN = void 0;
          aM = void 0;
          aJ = void 0;
          aI = void 0;
          aP = void 0;
          aO = false;
          aK = false;
          ay = aQ;
          if (Y === c) {
            aI = D.scrollTop();
            aP = D.scrollLeft();
            D.css({
              overflow: "hidden",
              padding: 0
            });
            aj = D.innerWidth() + f;
            v = D.innerHeight();
            D.width(aj);
            Y = b("<div class=\"jspPane\" />").css("padding", aH).append(D.children());
            al = b("<div class=\"jspContainer\" />").css({
              width: aj + "px",
              height: v + "px"
            }).append(Y).appendTo(D);
          } else {
            D.css("width", "");
            aO = ay.stickToBottom && K();
            aK = ay.stickToRight && B();
            aJ = D.innerWidth() + f !== aj || D.outerHeight() !== v;
            if (aJ) {
              aj = D.innerWidth() + f;
              v = D.innerHeight();
              al.css({
                width: aj + "px",
                height: v + "px"
              });
            }
            if (!aJ && L === T && Y.outerHeight() === Z) {
              D.width(aj);
              return;
            }
            L = T;
            Y.css("width", "");
            D.width(aj);
            al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end();
          }
          Y.css("overflow", "auto");
          if (aQ.contentWidth) {
            T = aQ.contentWidth;
          } else {
            T = Y[0].scrollWidth;
          }
          Z = Y[0].scrollHeight;
          Y.css("overflow", "");
          y = T / aj;
          q = Z / v;
          az = q > 1;
          aE = y > 1;
          if (!(aE || az)) {
            D.removeClass("jspScrollable");
            Y.css({
              top: 0,
              width: al.width() - f
            });
            n();
            E();
            R();
            w();
          } else {
            D.addClass("jspScrollable");
            aL = ay.maintainPosition && (I || aa);
            if (aL) {
              aN = aC();
              aM = aA();
            }
            aF();
            z();
            F();
            if (aL) {
              N((aK ? T - aj : aN), false);
              M((aO ? Z - v : aM), false);
            }
            J();
            ag();
            an();
            if (ay.enableKeyboardNavigation) {
              S();
            }
            if (ay.clickOnTrack) {
              p();
            }
            C();
            if (ay.hijackInternalLinks) {
              m();
            }
          }
          if (ay.autoReinitialise && !av) {
            av = setInterval(function() {
              ar(ay);
            }, ay.autoReinitialiseDelay);
          } else {
            if (!ay.autoReinitialise && av) {
              clearInterval(av);
            }
          }
          aI && D.scrollTop(0) && M(aI, false);
          aP && D.scrollLeft(0) && N(aP, false);
          D.trigger("jsp-initialised", [aE || az]);
        };
        aF = function() {
          var U, af, ap, aq, au, t;
          if (az) {
            al.append(b("<div class=\"jspVerticalBar\" />").append(b("<div class=\"jspCap jspCapTop\" />"), b("<div class=\"jspTrack\" />").append(b("<div class=\"jspDrag\" />").append(b("<div class=\"jspDragTop\" />"), b("<div class=\"jspDragBottom\" />"))), b("<div class=\"jspCap jspCapBottom\" />")));
            U = al.find(">.jspVerticalBar");
            ap = U.find(">.jspTrack");
            au = ap.find(">.jspDrag");
            if (ay.showArrows) {
              aq = b("<a class=\"jspArrow jspArrowUp\" />").bind("mousedown.jsp", aD(0, -1)).bind("click.jsp", aB);
              af = b("<a class=\"jspArrow jspArrowDown\" />").bind("mousedown.jsp", aD(0, 1)).bind("click.jsp", aB);
              if (ay.arrowScrollOnHover) {
                aq.bind("mouseover.jsp", aD(0, -1, aq));
                af.bind("mouseover.jsp", aD(0, 1, af));
              }
              ak(ap, ay.verticalArrowPositions, aq, af);
            }
            t = v;
            al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
              t -= b(this).outerHeight();
            });
            au.hover(function() {
              au.addClass("jspHover");
            }, function() {
              au.removeClass("jspHover");
            }).bind("mousedown.jsp", function(aI) {
              var s;
              b("html").bind("dragstart.jsp selectstart.jsp", aB);
              au.addClass("jspActive");
              s = aI.pageY - au.position().top;
              b("html").bind("mousemove.jsp", function(aJ) {
                V(aJ.pageY - s, false);
              }).bind("mouseup.jsp mouseleave.jsp", aw);
              return false;
            });
            o();
          }
        };
        o = function() {
          var I, X;
          ap.height(t + "px");
          I = 0;
          X = ay.verticalGutter + ap.outerWidth();
          Y.width(aj - X - f);
          try {
            if (U.position().left === 0) {
              Y.css("margin-left", X + "px");
            }
          } catch (_error) {}
        };
        z = function() {
          var G, am, ax, h, l, x;
          if (aE) {
            al.append(b("<div class=\"jspHorizontalBar\" />").append(b("<div class=\"jspCap jspCapLeft\" />"), b("<div class=\"jspTrack\" />").append(b("<div class=\"jspDrag\" />").append(b("<div class=\"jspDragLeft\" />"), b("<div class=\"jspDragRight\" />"))), b("<div class=\"jspCap jspCapRight\" />")));
            am = al.find(">.jspHorizontalBar");
            G = am.find(">.jspTrack");
            h = G.find(">.jspDrag");
            if (ay.showArrows) {
              ax = b("<a class=\"jspArrow jspArrowLeft\" />").bind("mousedown.jsp", aD(-1, 0)).bind("click.jsp", aB);
              x = b("<a class=\"jspArrow jspArrowRight\" />").bind("mousedown.jsp", aD(1, 0)).bind("click.jsp", aB);
              if (ay.arrowScrollOnHover) {
                ax.bind("mouseover.jsp", aD(-1, 0, ax));
                x.bind("mouseover.jsp", aD(1, 0, x));
              }
              ak(G, ay.horizontalArrowPositions, ax, x);
            }
            h.hover(function() {
              h.addClass("jspHover");
            }, function() {
              h.removeClass("jspHover");
            }).bind("mousedown.jsp", function(aI) {
              var s;
              b("html").bind("dragstart.jsp selectstart.jsp", aB);
              h.addClass("jspActive");
              s = aI.pageX - h.position().left;
              b("html").bind("mousemove.jsp", function(aJ) {
                W(aJ.pageX - s, false);
              }).bind("mouseup.jsp mouseleave.jsp", aw);
              return false;
            });
            l = al.innerWidth();
            ah();
          }
        };
        ah = function() {
          var aa;
          al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
            l -= b(this).outerWidth();
          });
          G.width(l + "px");
          aa = 0;
        };
        F = function() {
          var A, Z, aI, at, i, j, q, s;
          if (aE && az) {
            aI = G.outerHeight();
            s = ap.outerWidth();
            t -= aI;
            b(am).find(">.jspCap:visible,>.jspArrow").each(function() {
              l += b(this).outerWidth();
            });
            l -= s;
            v -= s;
            aj -= aI;
            G.parent().append(b("<div class=\"jspCorner\" />").css("width", aI + "px"));
            o();
            ah();
          }
          if (aE) {
            Y.width((al.outerWidth() - f) + "px");
          }
          Z = Y.outerHeight();
          q = Z / v;
          if (aE) {
            at = Math.ceil(1 / y * l);
            if (at > ay.horizontalDragMaxWidth) {
              at = ay.horizontalDragMaxWidth;
            } else {
              if (at < ay.horizontalDragMinWidth) {
                at = ay.horizontalDragMinWidth;
              }
            }
            h.width(at + "px");
            j = l - at;
            ae(aa);
          }
          if (az) {
            A = Math.ceil(1 / q * t);
            if (A > ay.verticalDragMaxHeight) {
              A = ay.verticalDragMaxHeight;
            } else {
              if (A < ay.verticalDragMinHeight) {
                A = ay.verticalDragMinHeight;
              }
            }
            au.height(A + "px");
            i = t - A;
            ad(I);
          }
        };
        ak = function(aJ, aL, aI, s) {
          var aK, aM, aN;
          aN = "before";
          aK = "after";
          aM = void 0;
          if (aL === "os") {
            aL = (/Mac/.test(navigator.platform) ? "after" : "split");
          }
          if (aL === aN) {
            aK = aL;
          } else {
            if (aL === aK) {
              aN = aL;
              aM = aI;
              aI = s;
              s = aM;
            }
          }
          aJ[aN](aI)[aK](s);
        };
        aD = function(aI, s, aJ) {
          return function() {
            H(aI, s, this, aJ);
            this.blur();
            return false;
          };
        };
        H = function(aL, aK, aO, aN) {
          var aI, aJ, aM, s;
          aO = b(aO).addClass("jspActive");
          aM = void 0;
          aJ = void 0;
          aI = true;
          s = function() {
            if (aL !== 0) {
              Q.scrollByX(aL * ay.arrowButtonSpeed);
            }
            if (aK !== 0) {
              Q.scrollByY(aK * ay.arrowButtonSpeed);
            }
            aJ = setTimeout(s, (aI ? ay.initialDelay : ay.arrowRepeatFreq));
            aI = false;
          };
          s();
          aM = (aN ? "mouseout.jsp" : "mouseup.jsp");
          aN = aN || b("html");
          aN.bind(aM, function() {
            aO.removeClass("jspActive");
            aJ && clearTimeout(aJ);
            aJ = null;
            aN.unbind(aM);
          });
        };
        p = function() {
          w();
          if (az) {
            ap.bind("mousedown.jsp", function(aN) {
              var aI, aJ, aK, aL, aM, aO, s;
              if (aN.originalTarget === c || aN.originalTarget === aN.currentTarget) {
                aL = b(this);
                aO = aL.offset();
                aM = aN.pageY - aO.top - I;
                aJ = void 0;
                aI = true;
                s = function() {
                  var aP, aQ, aR, aS;
                  aR = aL.offset();
                  aS = aN.pageY - aR.top - A / 2;
                  aP = v * ay.scrollPagePercent;
                  aQ = i * aP / (Z - v);
                  if (aM < 0) {
                    if (I - aQ > aS) {
                      Q.scrollByY(-aP);
                    } else {
                      V(aS);
                    }
                  } else {
                    if (aM > 0) {
                      if (I + aQ < aS) {
                        Q.scrollByY(aP);
                      } else {
                        V(aS);
                      }
                    } else {
                      aK();
                      return;
                    }
                  }
                  aJ = setTimeout(s, (aI ? ay.initialDelay : ay.trackClickRepeatFreq));
                  aI = false;
                };
                aK = function() {
                  aJ && clearTimeout(aJ);
                  aJ = null;
                  b(document).unbind("mouseup.jsp", aK);
                };
                s();
                b(document).bind("mouseup.jsp", aK);
                return false;
              }
            });
          }
          if (aE) {
            G.bind("mousedown.jsp", function(aN) {
              var aI, aJ, aK, aL, aM, aO, s;
              if (aN.originalTarget === c || aN.originalTarget === aN.currentTarget) {
                aL = b(this);
                aO = aL.offset();
                aM = aN.pageX - aO.left - aa;
                aJ = void 0;
                aI = true;
                s = function() {
                  var aP, aQ, aR, aS;
                  aR = aL.offset();
                  aS = aN.pageX - aR.left - at / 2;
                  aP = aj * ay.scrollPagePercent;
                  aQ = j * aP / (T - aj);
                  if (aM < 0) {
                    if (aa - aQ > aS) {
                      Q.scrollByX(-aP);
                    } else {
                      W(aS);
                    }
                  } else {
                    if (aM > 0) {
                      if (aa + aQ < aS) {
                        Q.scrollByX(aP);
                      } else {
                        W(aS);
                      }
                    } else {
                      aK();
                      return;
                    }
                  }
                  aJ = setTimeout(s, (aI ? ay.initialDelay : ay.trackClickRepeatFreq));
                  aI = false;
                };
                aK = function() {
                  aJ && clearTimeout(aJ);
                  aJ = null;
                  b(document).unbind("mouseup.jsp", aK);
                };
                s();
                b(document).bind("mouseup.jsp", aK);
                return false;
              }
            });
          }
        };
        w = function() {
          if (G) {
            G.unbind("mousedown.jsp");
          }
          if (ap) {
            ap.unbind("mousedown.jsp");
          }
        };
        aw = function() {
          b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
          if (au) {
            au.removeClass("jspActive");
          }
          if (h) {
            h.removeClass("jspActive");
          }
        };
        V = function(s, aI) {
          if (!az) {
            return;
          }
          if (s < 0) {
            s = 0;
          } else {
            if (s > i) {
              s = i;
            }
          }
          if (aI === c) {
            aI = ay.animateScroll;
          }
          if (aI) {
            Q.animate(au, "top", s, ad);
          } else {
            au.css("top", s);
            ad(s);
          }
        };
        ad = function(aI) {
          var I, aG, aJ, aK, aL, ai, s;
          if (aI === c) {
            aI = au.position().top;
          }
          al.scrollTop(0);
          I = aI;
          aL = I === 0;
          aJ = I === i;
          aK = aI / i;
          s = -aK * (Z - v);
          if (ai !== aL || aG !== aJ) {
            ai = aL;
            aG = aJ;
            D.trigger("jsp-arrow-change", [ai, aG, P, k]);
          }
          u(aL, aJ);
          Y.css("top", s);
          D.trigger("jsp-scroll-y", [-s, aL, aJ]).trigger("scroll");
        };
        W = function(aI, s) {
          if (!aE) {
            return;
          }
          if (aI < 0) {
            aI = 0;
          } else {
            if (aI > j) {
              aI = j;
            }
          }
          if (s === c) {
            s = ay.animateScroll;
          }
          if (s) {
            Q.animate(h, "left", aI, ae);
          } else {
            h.css("left", aI);
            ae(aI);
          }
        };
        ae = function(aI) {
          var P, aJ, aK, aL, aa, k, s;
          if (aI === c) {
            aI = h.position().left;
          }
          al.scrollTop(0);
          aa = aI;
          aL = aa === 0;
          aK = aa === j;
          aJ = aI / j;
          s = -aJ * (T - aj);
          if (P !== aL || k !== aK) {
            P = aL;
            k = aK;
            D.trigger("jsp-arrow-change", [ai, aG, P, k]);
          }
          r(aL, aK);
          Y.css("left", s);
          D.trigger("jsp-scroll-x", [-s, aL, aK]).trigger("scroll");
        };
        u = function(aI, s) {
          if (ay.showArrows) {
            aq[(aI ? "addClass" : "removeClass")]("jspDisabled");
            af[(s ? "addClass" : "removeClass")]("jspDisabled");
          }
        };
        r = function(aI, s) {
          if (ay.showArrows) {
            ax[(aI ? "addClass" : "removeClass")]("jspDisabled");
            x[(s ? "addClass" : "removeClass")]("jspDisabled");
          }
        };
        M = function(s, aI) {
          var aJ;
          aJ = s / (Z - v);
          V(aJ * i, aI);
        };
        N = function(aI, s) {
          var aJ;
          aJ = aI / (T - aj);
          W(aJ * j, s);
        };
        ab = function(aV, aQ, aJ) {
          var aI, aK, aL, aM, aN, aO, aP, aR, aS, aT, aU, s;
          aN = void 0;
          aK = void 0;
          aL = void 0;
          s = 0;
          aU = 0;
          aI = void 0;
          aP = void 0;
          aO = void 0;
          aS = void 0;
          aR = void 0;
          aT = void 0;
          try {
            aN = b(aV);
          } catch (_error) {
            aM = _error;
            return;
          }
          aK = aN.outerHeight();
          aL = aN.outerWidth();
          al.scrollTop(0);
          al.scrollLeft(0);
          while (!aN.is(".jspPane")) {
            s += aN.position().top;
            aU += aN.position().left;
            aN = aN.offsetParent();
            if (/^body|html$/i.test(aN[0].nodeName)) {
              return;
            }
          }
          aI = aA();
          aO = aI + v;
          if (s < aI || aQ) {
            aR = s - ay.verticalGutter;
          } else {
            if (s + aK > aO) {
              aR = s - v + aK + ay.verticalGutter;
            }
          }
          if (aR) {
            M(aR, aJ);
          }
          aP = aC();
          aS = aP + aj;
          if (aU < aP || aQ) {
            aT = aU - ay.horizontalGutter;
          } else {
            if (aU + aL > aS) {
              aT = aU - aj + aL + ay.horizontalGutter;
            }
          }
          if (aT) {
            N(aT, aJ);
          }
        };
        aC = function() {
          return -Y.position().left;
        };
        aA = function() {
          return -Y.position().top;
        };
        K = function() {
          var s;
          s = Z - v;
          return (s > 20) && (s - aA() < 10);
        };
        B = function() {
          var s;
          s = T - aj;
          return (s > 20) && (s - aC() < 10);
        };
        ag = function() {
          al.unbind(ac).bind(ac, function(aL, aM, aK, aI) {
            var aJ, s;
            aJ = aa;
            s = I;
            Q.scrollBy(aK * ay.mouseWheelSpeed, -aI * ay.mouseWheelSpeed, false);
            return aJ === aa && s === I;
          });
        };
        n = function() {
          al.unbind(ac);
        };
        aB = function() {
          return false;
        };
        J = function() {
          Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(s) {
            ab(s.target, false);
          });
        };
        E = function() {
          Y.find(":input,a").unbind("focus.jsp");
        };
        S = function() {
          var aI, aJ, aK, s;
          aJ = function() {
            var aI, aL, aM;
            aM = aa;
            aL = I;
            switch (s) {
              case 40:
                Q.scrollByY(ay.keyboardSpeed, false);
                break;
              case 38:
                Q.scrollByY(-ay.keyboardSpeed, false);
                break;
              case 34:
              case 32:
                Q.scrollByY(v * ay.scrollPagePercent, false);
                break;
              case 33:
                Q.scrollByY(-v * ay.scrollPagePercent, false);
                break;
              case 39:
                Q.scrollByX(ay.keyboardSpeed, false);
                break;
              case 37:
                Q.scrollByX(-ay.keyboardSpeed, false);
            }
            aI = aM !== aa || aL !== I;
            return aI;
          };
          s = void 0;
          aI = void 0;
          aK = [];
          aE && aK.push(am[0]);
          az && aK.push(U[0]);
          Y.focus(function() {
            D.focus();
          });
          D.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(aN) {
            var aL, aM;
            if (aN.target !== this && !(aK.length && b(aN.target).closest(aK).length)) {
              return;
            }
            aM = aa;
            aL = I;
            switch (aN.keyCode) {
              case 40:
              case 38:
              case 34:
              case 33:
              case 39:
              case 37:
                s = aN.keyCode;
                aJ();
                break;
              case 35:
                M(Z - v);
                s = null;
                break;
              case 36:
                M(0);
                s = null;
            }
            aI = aN.keyCode === s && aM !== aa || aL !== I;
            return !aI;
          }).bind("keypress.jsp", function(aL) {
            if (aL.keyCode === s) {
              aJ();
            }
            return !aI;
          });
          if (ay.hideFocus) {
            D.css("outline", "none");
            if ("hideFocus" in al[0]) {
              D.attr("hideFocus", true);
            }
          } else {
            D.css("outline", "");
            if ("hideFocus" in al[0]) {
              D.attr("hideFocus", false);
            }
          }
        };
        R = function() {
          D.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp");
        };
        C = function() {
          var aI, aJ, aK, s;
          if (location.hash && location.hash.length > 1) {
            aK = void 0;
            aI = void 0;
            aJ = escape(location.hash.substr(1));
            try {
              aK = b("#" + aJ + ", a[name=\"" + aJ + "\"]");
            } catch (_error) {
              s = _error;
              return;
            }
            if (aK.length && Y.find(aJ)) {
              if (al.scrollTop() === 0) {
                aI = setInterval(function() {
                  if (al.scrollTop() > 0) {
                    ab(aK, true);
                    b(document).scrollTop(al.position().top);
                    clearInterval(aI);
                  }
                }, 50);
              } else {
                ab(aK, true);
                b(document).scrollTop(al.position().top);
              }
            }
          }
        };
        m = function() {
          if (b(document.body).data("jspHijack")) {
            return;
          }
          b(document.body).data("jspHijack", true);
          b(document.body).delegate("a[href*=#]", "click", function(s) {
            var aI, aJ, aK, aL, aM, aN, aO, aP, aQ;
            aI = this.href.substr(0, this.href.indexOf("#"));
            aK = location.href;
            aO = void 0;
            aP = void 0;
            aJ = void 0;
            aM = void 0;
            aL = void 0;
            aN = void 0;
            if (location.href.indexOf("#") !== -1) {
              aK = location.href.substr(0, location.href.indexOf("#"));
            }
            if (aI !== aK) {
              return;
            }
            aO = escape(this.href.substr(this.href.indexOf("#") + 1));
            aP;
            try {
              aP = b("#" + aO + ", a[name=\"" + aO + "\"]");
            } catch (_error) {
              aQ = _error;
              return;
            }
            if (!aP.length) {
              return;
            }
            aJ = aP.closest(".jspScrollable");
            aM = aJ.data("jsp");
            aM.scrollToElement(aP, true);
            if (aJ[0].scrollIntoView) {
              aL = b(a).scrollTop();
              aN = aP.offset().top;
              if (aN < aL || aN > aL + b(a).height()) {
                aJ[0].scrollIntoView();
              }
            }
            s.preventDefault();
          });
        };
        an = function() {
          var aI, aJ, aK, aL, aM, s;
          aJ = void 0;
          aI = void 0;
          aL = void 0;
          aK = void 0;
          aM = void 0;
          s = false;
          al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(aN) {
            var aO;
            aO = aN.originalEvent.touches[0];
            aJ = aC();
            aI = aA();
            aL = aO.pageX;
            aK = aO.pageY;
            aM = false;
            s = true;
          }).bind("touchmove.jsp", function(aQ) {
            var aN, aO, aP;
            if (!s) {
              return;
            }
            aP = aQ.originalEvent.touches[0];
            aO = aa;
            aN = I;
            Q.scrollTo(aJ + aL - aP.pageX, aI + aK - aP.pageY);
            aM = aM || Math.abs(aL - aP.pageX) > 5 || Math.abs(aK - aP.pageY) > 5;
            return aO === aa && aN === I;
          }).bind("touchend.jsp", function(aN) {
            s = false;
          }).bind("click.jsp-touchclick", function(aN) {
            if (aM) {
              aM = false;
              return false;
            }
          });
        };
        g = function() {
          var aI, s;
          s = aA();
          aI = aC();
          D.removeClass("jspScrollable").unbind(".jsp");
          D.replaceWith(ao.append(Y.children()));
          ao.scrollTop(s);
          ao.scrollLeft(aI);
          if (av) {
            clearInterval(av);
          }
        };
        ay = void 0;
        Q = this;
        Y = void 0;
        aj = void 0;
        v = void 0;
        al = void 0;
        T = void 0;
        Z = void 0;
        y = void 0;
        q = void 0;
        az = void 0;
        aE = void 0;
        au = void 0;
        i = void 0;
        I = void 0;
        h = void 0;
        j = void 0;
        aa = void 0;
        U = void 0;
        ap = void 0;
        X = void 0;
        t = void 0;
        A = void 0;
        aq = void 0;
        af = void 0;
        am = void 0;
        G = void 0;
        l = void 0;
        at = void 0;
        ax = void 0;
        x = void 0;
        av = void 0;
        aH = void 0;
        f = void 0;
        L = void 0;
        ai = true;
        P = true;
        aG = false;
        k = false;
        ao = D.clone(false, false).empty();
        ac = (b.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp");
        aH = D.css("paddingTop") + " " + D.css("paddingRight") + " " + D.css("paddingBottom") + " " + D.css("paddingLeft");
        f = (parseInt(D.css("paddingLeft"), 10) || 0) + (parseInt(D.css("paddingRight"), 10) || 0);
        b.extend(Q, {
          reinitialise: function(aI) {
            aI = b.extend({}, ay, aI);
            ar(aI);
          },
          scrollToElement: function(aJ, aI, s) {
            ab(aJ, aI, s);
          },
          scrollTo: function(aJ, s, aI) {
            N(aJ, aI);
            M(s, aI);
          },
          scrollToX: function(aI, s) {
            N(aI, s);
          },
          scrollToY: function(s, aI) {
            M(s, aI);
          },
          scrollToPercentX: function(aI, s) {
            N(aI * (T - aj), s);
          },
          scrollToPercentY: function(aI, s) {
            M(aI * (Z - v), s);
          },
          scrollBy: function(aI, s, aJ) {
            Q.scrollByX(aI, aJ);
            Q.scrollByY(s, aJ);
          },
          scrollByX: function(s, aJ) {
            var aI, aK;
            aI = aC() + Math[(s < 0 ? "floor" : "ceil")](s);
            aK = aI / (T - aj);
            W(aK * j, aJ);
          },
          scrollByY: function(s, aJ) {
            var aI, aK;
            aI = aA() + Math[(s < 0 ? "floor" : "ceil")](s);
            aK = aI / (Z - v);
            V(aK * i, aJ);
          },
          positionDragX: function(s, aI) {
            W(s, aI);
          },
          positionDragY: function(aI, s) {
            V(aI, s);
          },
          animate: function(aI, aL, s, aK) {
            var aJ;
            aJ = {};
            aJ[aL] = s;
            aI.animate(aJ, {
              duration: ay.animateDuration,
              easing: ay.animateEase,
              queue: false,
              step: aK
            });
          },
          getContentPositionX: function() {
            return aC();
          },
          getContentPositionY: function() {
            return aA();
          },
          getContentWidth: function() {
            return T;
          },
          getContentHeight: function() {
            return Z;
          },
          getPercentScrolledX: function() {
            return aC() / (T - aj);
          },
          getPercentScrolledY: function() {
            return aA() / (Z - v);
          },
          getIsScrollableH: function() {
            return aE;
          },
          getIsScrollableV: function() {
            return az;
          },
          getContentPane: function() {
            return Y;
          },
          scrollToBottom: function(s) {
            V(i, s);
          },
          hijackInternalLinks: b.noop,
          destroy: function() {
            g();
          }
        });
        ar(O);
      };
      e = b.extend({}, b.fn.jScrollPane.defaults, e);
      b.each(["mouseWheelSpeed", "arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
        e[this] = e[this] || e.speed;
      });
      return this.each(function() {
        var f, g;
        f = b(this);
        g = f.data("jsp");
        if (g) {
          g.reinitialise(e);
        } else {
          b("script", f).filter("[type=\"text/javascript\"],:not([type])").remove();
          g = new d(f, e);
          f.data("jsp", g);
        }
      });
    };
    b.fn.jScrollPane.defaults = {
      showArrows: false,
      maintainPosition: true,
      stickToBottom: false,
      stickToRight: false,
      clickOnTrack: true,
      autoReinitialise: false,
      autoReinitialiseDelay: 500,
      verticalDragMinHeight: 0,
      verticalDragMaxHeight: 99999,
      horizontalDragMinWidth: 0,
      horizontalDragMaxWidth: 99999,
      contentWidth: c,
      animateScroll: false,
      animateDuration: 300,
      animateEase: "linear",
      hijackInternalLinks: false,
      verticalGutter: 4,
      horizontalGutter: 4,
      mouseWheelSpeed: 0,
      arrowButtonSpeed: 0,
      arrowRepeatFreq: 50,
      arrowScrollOnHover: false,
      trackClickSpeed: 0,
      trackClickRepeatFreq: 70,
      verticalArrowPositions: "split",
      horizontalArrowPositions: "split",
      enableKeyboardNavigation: true,
      hideFocus: false,
      keyboardSpeed: 0,
      initialDelay: 300,
      speed: 30,
      scrollPagePercent: 0.8
    };
  })(jQuery, this);

}).call(this);

(function() {
  (function(b, a, c) {
    b.fn.jScrollPane = function(e) {
      var d;
      d = function(D, O) {
        var A, B, C, E, F, G, H, I, J, K, L, M, N, P, Q, R, S, T, U, V, W, X, Y, Z, aA, aB, aC, aD, aE, aF, aG, aH, aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, an, ao, ap, aq, ar, at, au, av, aw, ax, ay, az, f, g, h, i, j, k, l, m, n, o, p, q, r, t, u, v, w, x, y, z;
        ar = function(aQ) {
          var L, T, Y, Z, aE, aI, aJ, aK, aL, aM, aN, aO, aP, aj, al, av, ay, az, q, v, y;
          aL = void 0;
          aN = void 0;
          aM = void 0;
          aJ = void 0;
          aI = void 0;
          aP = void 0;
          aO = false;
          aK = false;
          ay = aQ;
          if (Y === c) {
            aI = D.scrollTop();
            aP = D.scrollLeft();
            D.css({
              overflow: "hidden",
              padding: 0
            });
            aj = D.innerWidth() + f;
            v = D.innerHeight();
            D.width(aj);
            Y = b("<div class=\"jspPane\" />").css("padding", aH).append(D.children());
            al = b("<div class=\"jspContainer\" />").css({
              width: aj + "px",
              height: v + "px"
            }).append(Y).appendTo(D);
          } else {
            D.css("width", "");
            aO = ay.stickToBottom && K();
            aK = ay.stickToRight && B();
            aJ = D.innerWidth() + f !== aj || D.outerHeight() !== v;
            if (aJ) {
              aj = D.innerWidth() + f;
              v = D.innerHeight();
              al.css({
                width: aj + "px",
                height: v + "px"
              });
            }
            if (!aJ && L === T && Y.outerHeight() === Z) {
              D.width(aj);
              return;
            }
            L = T;
            Y.css("width", "");
            D.width(aj);
            al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end();
          }
          Y.css("overflow", "auto");
          if (aQ.contentWidth) {
            T = aQ.contentWidth;
          } else {
            T = Y[0].scrollWidth;
          }
          Z = Y[0].scrollHeight;
          Y.css("overflow", "");
          y = T / aj;
          q = Z / v;
          az = q > 1;
          aE = y > 1;
          if (!(aE || az)) {
            D.removeClass("jspScrollable");
            Y.css({
              top: 0,
              width: al.width() - f
            });
            n();
            E();
            R();
            w();
          } else {
            D.addClass("jspScrollable");
            aL = ay.maintainPosition && (I || aa);
            if (aL) {
              aN = aC();
              aM = aA();
            }
            aF();
            z();
            F();
            if (aL) {
              N((aK ? T - aj : aN), false);
              M((aO ? Z - v : aM), false);
            }
            J();
            ag();
            an();
            if (ay.enableKeyboardNavigation) {
              S();
            }
            if (ay.clickOnTrack) {
              p();
            }
            C();
            if (ay.hijackInternalLinks) {
              m();
            }
          }
          if (ay.autoReinitialise && !av) {
            av = setInterval(function() {
              ar(ay);
            }, ay.autoReinitialiseDelay);
          } else {
            if (!ay.autoReinitialise && av) {
              clearInterval(av);
            }
          }
          aI && D.scrollTop(0) && M(aI, false);
          aP && D.scrollLeft(0) && N(aP, false);
          D.trigger("jsp-initialised", [aE || az]);
        };
        aF = function() {
          var U, af, ap, aq, au, t;
          if (az) {
            al.append(b("<div class=\"jspVerticalBar\" />").append(b("<div class=\"jspCap jspCapTop\" />"), b("<div class=\"jspTrack\" />").append(b("<div class=\"jspDrag\" />").append(b("<div class=\"jspDragTop\" />"), b("<div class=\"jspDragBottom\" />"))), b("<div class=\"jspCap jspCapBottom\" />")));
            U = al.find(">.jspVerticalBar");
            ap = U.find(">.jspTrack");
            au = ap.find(">.jspDrag");
            if (ay.showArrows) {
              aq = b("<a class=\"jspArrow jspArrowUp\" />").bind("mousedown.jsp", aD(0, -1)).bind("click.jsp", aB);
              af = b("<a class=\"jspArrow jspArrowDown\" />").bind("mousedown.jsp", aD(0, 1)).bind("click.jsp", aB);
              if (ay.arrowScrollOnHover) {
                aq.bind("mouseover.jsp", aD(0, -1, aq));
                af.bind("mouseover.jsp", aD(0, 1, af));
              }
              ak(ap, ay.verticalArrowPositions, aq, af);
            }
            t = v;
            al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
              t -= b(this).outerHeight();
            });
            au.hover(function() {
              au.addClass("jspHover");
            }, function() {
              au.removeClass("jspHover");
            }).bind("mousedown.jsp", function(aI) {
              var s;
              b("html").bind("dragstart.jsp selectstart.jsp", aB);
              au.addClass("jspActive");
              s = aI.pageY - au.position().top;
              b("html").bind("mousemove.jsp", function(aJ) {
                V(aJ.pageY - s, false);
              }).bind("mouseup.jsp mouseleave.jsp", aw);
              return false;
            });
            o();
          }
        };
        o = function() {
          var I, X;
          ap.height(t + "px");
          I = 0;
          X = ay.verticalGutter + ap.outerWidth();
          Y.width(aj - X - f);
          try {
            if (U.position().left === 0) {
              Y.css("margin-left", X + "px");
            }
          } catch (_error) {}
        };
        z = function() {
          var G, am, ax, h, l, x;
          if (aE) {
            al.append(b("<div class=\"jspHorizontalBar\" />").append(b("<div class=\"jspCap jspCapLeft\" />"), b("<div class=\"jspTrack\" />").append(b("<div class=\"jspDrag\" />").append(b("<div class=\"jspDragLeft\" />"), b("<div class=\"jspDragRight\" />"))), b("<div class=\"jspCap jspCapRight\" />")));
            am = al.find(">.jspHorizontalBar");
            G = am.find(">.jspTrack");
            h = G.find(">.jspDrag");
            if (ay.showArrows) {
              ax = b("<a class=\"jspArrow jspArrowLeft\" />").bind("mousedown.jsp", aD(-1, 0)).bind("click.jsp", aB);
              x = b("<a class=\"jspArrow jspArrowRight\" />").bind("mousedown.jsp", aD(1, 0)).bind("click.jsp", aB);
              if (ay.arrowScrollOnHover) {
                ax.bind("mouseover.jsp", aD(-1, 0, ax));
                x.bind("mouseover.jsp", aD(1, 0, x));
              }
              ak(G, ay.horizontalArrowPositions, ax, x);
            }
            h.hover(function() {
              h.addClass("jspHover");
            }, function() {
              h.removeClass("jspHover");
            }).bind("mousedown.jsp", function(aI) {
              var s;
              b("html").bind("dragstart.jsp selectstart.jsp", aB);
              h.addClass("jspActive");
              s = aI.pageX - h.position().left;
              b("html").bind("mousemove.jsp", function(aJ) {
                W(aJ.pageX - s, false);
              }).bind("mouseup.jsp mouseleave.jsp", aw);
              return false;
            });
            l = al.innerWidth();
            ah();
          }
        };
        ah = function() {
          var aa;
          al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
            l -= b(this).outerWidth();
          });
          G.width(l + "px");
          aa = 0;
        };
        F = function() {
          var A, Z, aI, at, i, j, q, s;
          if (aE && az) {
            aI = G.outerHeight();
            s = ap.outerWidth();
            t -= aI;
            b(am).find(">.jspCap:visible,>.jspArrow").each(function() {
              l += b(this).outerWidth();
            });
            l -= s;
            v -= s;
            aj -= aI;
            G.parent().append(b("<div class=\"jspCorner\" />").css("width", aI + "px"));
            o();
            ah();
          }
          if (aE) {
            Y.width((al.outerWidth() - f) + "px");
          }
          Z = Y.outerHeight();
          q = Z / v;
          if (aE) {
            at = Math.ceil(1 / y * l);
            if (at > ay.horizontalDragMaxWidth) {
              at = ay.horizontalDragMaxWidth;
            } else {
              if (at < ay.horizontalDragMinWidth) {
                at = ay.horizontalDragMinWidth;
              }
            }
            h.width(at + "px");
            j = l - at;
            ae(aa);
          }
          if (az) {
            A = Math.ceil(1 / q * t);
            if (A > ay.verticalDragMaxHeight) {
              A = ay.verticalDragMaxHeight;
            } else {
              if (A < ay.verticalDragMinHeight) {
                A = ay.verticalDragMinHeight;
              }
            }
            au.height(A + "px");
            i = t - A;
            ad(I);
          }
        };
        ak = function(aJ, aL, aI, s) {
          var aK, aM, aN;
          aN = "before";
          aK = "after";
          aM = void 0;
          if (aL === "os") {
            aL = (/Mac/.test(navigator.platform) ? "after" : "split");
          }
          if (aL === aN) {
            aK = aL;
          } else {
            if (aL === aK) {
              aN = aL;
              aM = aI;
              aI = s;
              s = aM;
            }
          }
          aJ[aN](aI)[aK](s);
        };
        aD = function(aI, s, aJ) {
          return function() {
            H(aI, s, this, aJ);
            this.blur();
            return false;
          };
        };
        H = function(aL, aK, aO, aN) {
          var aI, aJ, aM, s;
          aO = b(aO).addClass("jspActive");
          aM = void 0;
          aJ = void 0;
          aI = true;
          s = function() {
            if (aL !== 0) {
              Q.scrollByX(aL * ay.arrowButtonSpeed);
            }
            if (aK !== 0) {
              Q.scrollByY(aK * ay.arrowButtonSpeed);
            }
            aJ = setTimeout(s, (aI ? ay.initialDelay : ay.arrowRepeatFreq));
            aI = false;
          };
          s();
          aM = (aN ? "mouseout.jsp" : "mouseup.jsp");
          aN = aN || b("html");
          aN.bind(aM, function() {
            aO.removeClass("jspActive");
            aJ && clearTimeout(aJ);
            aJ = null;
            aN.unbind(aM);
          });
        };
        p = function() {
          w();
          if (az) {
            ap.bind("mousedown.jsp", function(aN) {
              var aI, aJ, aK, aL, aM, aO, s;
              if (aN.originalTarget === c || aN.originalTarget === aN.currentTarget) {
                aL = b(this);
                aO = aL.offset();
                aM = aN.pageY - aO.top - I;
                aJ = void 0;
                aI = true;
                s = function() {
                  var aP, aQ, aR, aS;
                  aR = aL.offset();
                  aS = aN.pageY - aR.top - A / 2;
                  aP = v * ay.scrollPagePercent;
                  aQ = i * aP / (Z - v);
                  if (aM < 0) {
                    if (I - aQ > aS) {
                      Q.scrollByY(-aP);
                    } else {
                      V(aS);
                    }
                  } else {
                    if (aM > 0) {
                      if (I + aQ < aS) {
                        Q.scrollByY(aP);
                      } else {
                        V(aS);
                      }
                    } else {
                      aK();
                      return;
                    }
                  }
                  aJ = setTimeout(s, (aI ? ay.initialDelay : ay.trackClickRepeatFreq));
                  aI = false;
                };
                aK = function() {
                  aJ && clearTimeout(aJ);
                  aJ = null;
                  b(document).unbind("mouseup.jsp", aK);
                };
                s();
                b(document).bind("mouseup.jsp", aK);
                return false;
              }
            });
          }
          if (aE) {
            G.bind("mousedown.jsp", function(aN) {
              var aI, aJ, aK, aL, aM, aO, s;
              if (aN.originalTarget === c || aN.originalTarget === aN.currentTarget) {
                aL = b(this);
                aO = aL.offset();
                aM = aN.pageX - aO.left - aa;
                aJ = void 0;
                aI = true;
                s = function() {
                  var aP, aQ, aR, aS;
                  aR = aL.offset();
                  aS = aN.pageX - aR.left - at / 2;
                  aP = aj * ay.scrollPagePercent;
                  aQ = j * aP / (T - aj);
                  if (aM < 0) {
                    if (aa - aQ > aS) {
                      Q.scrollByX(-aP);
                    } else {
                      W(aS);
                    }
                  } else {
                    if (aM > 0) {
                      if (aa + aQ < aS) {
                        Q.scrollByX(aP);
                      } else {
                        W(aS);
                      }
                    } else {
                      aK();
                      return;
                    }
                  }
                  aJ = setTimeout(s, (aI ? ay.initialDelay : ay.trackClickRepeatFreq));
                  aI = false;
                };
                aK = function() {
                  aJ && clearTimeout(aJ);
                  aJ = null;
                  b(document).unbind("mouseup.jsp", aK);
                };
                s();
                b(document).bind("mouseup.jsp", aK);
                return false;
              }
            });
          }
        };
        w = function() {
          if (G) {
            G.unbind("mousedown.jsp");
          }
          if (ap) {
            ap.unbind("mousedown.jsp");
          }
        };
        aw = function() {
          b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
          if (au) {
            au.removeClass("jspActive");
          }
          if (h) {
            h.removeClass("jspActive");
          }
        };
        V = function(s, aI) {
          if (!az) {
            return;
          }
          if (s < 0) {
            s = 0;
          } else {
            if (s > i) {
              s = i;
            }
          }
          if (aI === c) {
            aI = ay.animateScroll;
          }
          if (aI) {
            Q.animate(au, "top", s, ad);
          } else {
            au.css("top", s);
            ad(s);
          }
        };
        ad = function(aI) {
          var I, aG, aJ, aK, aL, ai, s;
          if (aI === c) {
            aI = au.position().top;
          }
          al.scrollTop(0);
          I = aI;
          aL = I === 0;
          aJ = I === i;
          aK = aI / i;
          s = -aK * (Z - v);
          if (ai !== aL || aG !== aJ) {
            ai = aL;
            aG = aJ;
            D.trigger("jsp-arrow-change", [ai, aG, P, k]);
          }
          u(aL, aJ);
          Y.css("top", s);
          D.trigger("jsp-scroll-y", [-s, aL, aJ]).trigger("scroll");
        };
        W = function(aI, s) {
          if (!aE) {
            return;
          }
          if (aI < 0) {
            aI = 0;
          } else {
            if (aI > j) {
              aI = j;
            }
          }
          if (s === c) {
            s = ay.animateScroll;
          }
          if (s) {
            Q.animate(h, "left", aI, ae);
          } else {
            h.css("left", aI);
            ae(aI);
          }
        };
        ae = function(aI) {
          var P, aJ, aK, aL, aa, k, s;
          if (aI === c) {
            aI = h.position().left;
          }
          al.scrollTop(0);
          aa = aI;
          aL = aa === 0;
          aK = aa === j;
          aJ = aI / j;
          s = -aJ * (T - aj);
          if (P !== aL || k !== aK) {
            P = aL;
            k = aK;
            D.trigger("jsp-arrow-change", [ai, aG, P, k]);
          }
          r(aL, aK);
          Y.css("left", s);
          D.trigger("jsp-scroll-x", [-s, aL, aK]).trigger("scroll");
        };
        u = function(aI, s) {
          if (ay.showArrows) {
            aq[(aI ? "addClass" : "removeClass")]("jspDisabled");
            af[(s ? "addClass" : "removeClass")]("jspDisabled");
          }
        };
        r = function(aI, s) {
          if (ay.showArrows) {
            ax[(aI ? "addClass" : "removeClass")]("jspDisabled");
            x[(s ? "addClass" : "removeClass")]("jspDisabled");
          }
        };
        M = function(s, aI) {
          var aJ;
          aJ = s / (Z - v);
          V(aJ * i, aI);
        };
        N = function(aI, s) {
          var aJ;
          aJ = aI / (T - aj);
          W(aJ * j, s);
        };
        ab = function(aV, aQ, aJ) {
          var aI, aK, aL, aM, aN, aO, aP, aR, aS, aT, aU, s;
          aN = void 0;
          aK = void 0;
          aL = void 0;
          s = 0;
          aU = 0;
          aI = void 0;
          aP = void 0;
          aO = void 0;
          aS = void 0;
          aR = void 0;
          aT = void 0;
          try {
            aN = b(aV);
          } catch (_error) {
            aM = _error;
            return;
          }
          aK = aN.outerHeight();
          aL = aN.outerWidth();
          al.scrollTop(0);
          al.scrollLeft(0);
          while (!aN.is(".jspPane")) {
            s += aN.position().top;
            aU += aN.position().left;
            aN = aN.offsetParent();
            if (/^body|html$/i.test(aN[0].nodeName)) {
              return;
            }
          }
          aI = aA();
          aO = aI + v;
          if (s < aI || aQ) {
            aR = s - ay.verticalGutter;
          } else {
            if (s + aK > aO) {
              aR = s - v + aK + ay.verticalGutter;
            }
          }
          if (aR) {
            M(aR, aJ);
          }
          aP = aC();
          aS = aP + aj;
          if (aU < aP || aQ) {
            aT = aU - ay.horizontalGutter;
          } else {
            if (aU + aL > aS) {
              aT = aU - aj + aL + ay.horizontalGutter;
            }
          }
          if (aT) {
            N(aT, aJ);
          }
        };
        aC = function() {
          return -Y.position().left;
        };
        aA = function() {
          return -Y.position().top;
        };
        K = function() {
          var s;
          s = Z - v;
          return (s > 20) && (s - aA() < 10);
        };
        B = function() {
          var s;
          s = T - aj;
          return (s > 20) && (s - aC() < 10);
        };
        ag = function() {
          al.unbind(ac).bind(ac, function(aL, aM, aK, aI) {
            var aJ, s;
            aJ = aa;
            s = I;
            Q.scrollBy(aK * ay.mouseWheelSpeed, -aI * ay.mouseWheelSpeed, false);
            return aJ === aa && s === I;
          });
        };
        n = function() {
          al.unbind(ac);
        };
        aB = function() {
          return false;
        };
        J = function() {
          Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(s) {
            ab(s.target, false);
          });
        };
        E = function() {
          Y.find(":input,a").unbind("focus.jsp");
        };
        S = function() {
          var aI, aJ, aK, s;
          aJ = function() {
            var aI, aL, aM;
            aM = aa;
            aL = I;
            switch (s) {
              case 40:
                Q.scrollByY(ay.keyboardSpeed, false);
                break;
              case 38:
                Q.scrollByY(-ay.keyboardSpeed, false);
                break;
              case 34:
              case 32:
                Q.scrollByY(v * ay.scrollPagePercent, false);
                break;
              case 33:
                Q.scrollByY(-v * ay.scrollPagePercent, false);
                break;
              case 39:
                Q.scrollByX(ay.keyboardSpeed, false);
                break;
              case 37:
                Q.scrollByX(-ay.keyboardSpeed, false);
            }
            aI = aM !== aa || aL !== I;
            return aI;
          };
          s = void 0;
          aI = void 0;
          aK = [];
          aE && aK.push(am[0]);
          az && aK.push(U[0]);
          Y.focus(function() {
            D.focus();
          });
          D.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(aN) {
            var aL, aM;
            if (aN.target !== this && !(aK.length && b(aN.target).closest(aK).length)) {
              return;
            }
            aM = aa;
            aL = I;
            switch (aN.keyCode) {
              case 40:
              case 38:
              case 34:
              case 33:
              case 39:
              case 37:
                s = aN.keyCode;
                aJ();
                break;
              case 35:
                M(Z - v);
                s = null;
                break;
              case 36:
                M(0);
                s = null;
            }
            aI = aN.keyCode === s && aM !== aa || aL !== I;
            return !aI;
          }).bind("keypress.jsp", function(aL) {
            if (aL.keyCode === s) {
              aJ();
            }
            return !aI;
          });
          if (ay.hideFocus) {
            D.css("outline", "none");
            if ("hideFocus" in al[0]) {
              D.attr("hideFocus", true);
            }
          } else {
            D.css("outline", "");
            if ("hideFocus" in al[0]) {
              D.attr("hideFocus", false);
            }
          }
        };
        R = function() {
          D.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp");
        };
        C = function() {
          var aI, aJ, aK, s;
          if (location.hash && location.hash.length > 1) {
            aK = void 0;
            aI = void 0;
            aJ = escape(location.hash.substr(1));
            try {
              aK = b("#" + aJ + ", a[name=\"" + aJ + "\"]");
            } catch (_error) {
              s = _error;
              return;
            }
            if (aK.length && Y.find(aJ)) {
              if (al.scrollTop() === 0) {
                aI = setInterval(function() {
                  if (al.scrollTop() > 0) {
                    ab(aK, true);
                    b(document).scrollTop(al.position().top);
                    clearInterval(aI);
                  }
                }, 50);
              } else {
                ab(aK, true);
                b(document).scrollTop(al.position().top);
              }
            }
          }
        };
        m = function() {
          if (b(document.body).data("jspHijack")) {
            return;
          }
          b(document.body).data("jspHijack", true);
          b(document.body).delegate("a[href*=#]", "click", function(s) {
            var aI, aJ, aK, aL, aM, aN, aO, aP, aQ;
            aI = this.href.substr(0, this.href.indexOf("#"));
            aK = location.href;
            aO = void 0;
            aP = void 0;
            aJ = void 0;
            aM = void 0;
            aL = void 0;
            aN = void 0;
            if (location.href.indexOf("#") !== -1) {
              aK = location.href.substr(0, location.href.indexOf("#"));
            }
            if (aI !== aK) {
              return;
            }
            aO = escape(this.href.substr(this.href.indexOf("#") + 1));
            aP;
            try {
              aP = b("#" + aO + ", a[name=\"" + aO + "\"]");
            } catch (_error) {
              aQ = _error;
              return;
            }
            if (!aP.length) {
              return;
            }
            aJ = aP.closest(".jspScrollable");
            aM = aJ.data("jsp");
            aM.scrollToElement(aP, true);
            if (aJ[0].scrollIntoView) {
              aL = b(a).scrollTop();
              aN = aP.offset().top;
              if (aN < aL || aN > aL + b(a).height()) {
                aJ[0].scrollIntoView();
              }
            }
            s.preventDefault();
          });
        };
        an = function() {
          var aI, aJ, aK, aL, aM, s;
          aJ = void 0;
          aI = void 0;
          aL = void 0;
          aK = void 0;
          aM = void 0;
          s = false;
          al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(aN) {
            var aO;
            aO = aN.originalEvent.touches[0];
            aJ = aC();
            aI = aA();
            aL = aO.pageX;
            aK = aO.pageY;
            aM = false;
            s = true;
          }).bind("touchmove.jsp", function(aQ) {
            var aN, aO, aP;
            if (!s) {
              return;
            }
            aP = aQ.originalEvent.touches[0];
            aO = aa;
            aN = I;
            Q.scrollTo(aJ + aL - aP.pageX, aI + aK - aP.pageY);
            aM = aM || Math.abs(aL - aP.pageX) > 5 || Math.abs(aK - aP.pageY) > 5;
            return aO === aa && aN === I;
          }).bind("touchend.jsp", function(aN) {
            s = false;
          }).bind("click.jsp-touchclick", function(aN) {
            if (aM) {
              aM = false;
              return false;
            }
          });
        };
        g = function() {
          var aI, s;
          s = aA();
          aI = aC();
          D.removeClass("jspScrollable").unbind(".jsp");
          D.replaceWith(ao.append(Y.children()));
          ao.scrollTop(s);
          ao.scrollLeft(aI);
          if (av) {
            clearInterval(av);
          }
        };
        ay = void 0;
        Q = this;
        Y = void 0;
        aj = void 0;
        v = void 0;
        al = void 0;
        T = void 0;
        Z = void 0;
        y = void 0;
        q = void 0;
        az = void 0;
        aE = void 0;
        au = void 0;
        i = void 0;
        I = void 0;
        h = void 0;
        j = void 0;
        aa = void 0;
        U = void 0;
        ap = void 0;
        X = void 0;
        t = void 0;
        A = void 0;
        aq = void 0;
        af = void 0;
        am = void 0;
        G = void 0;
        l = void 0;
        at = void 0;
        ax = void 0;
        x = void 0;
        av = void 0;
        aH = void 0;
        f = void 0;
        L = void 0;
        ai = true;
        P = true;
        aG = false;
        k = false;
        ao = D.clone(false, false).empty();
        ac = (b.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp");
        aH = D.css("paddingTop") + " " + D.css("paddingRight") + " " + D.css("paddingBottom") + " " + D.css("paddingLeft");
        f = (parseInt(D.css("paddingLeft"), 10) || 0) + (parseInt(D.css("paddingRight"), 10) || 0);
        b.extend(Q, {
          reinitialise: function(aI) {
            aI = b.extend({}, ay, aI);
            ar(aI);
          },
          scrollToElement: function(aJ, aI, s) {
            ab(aJ, aI, s);
          },
          scrollTo: function(aJ, s, aI) {
            N(aJ, aI);
            M(s, aI);
          },
          scrollToX: function(aI, s) {
            N(aI, s);
          },
          scrollToY: function(s, aI) {
            M(s, aI);
          },
          scrollToPercentX: function(aI, s) {
            N(aI * (T - aj), s);
          },
          scrollToPercentY: function(aI, s) {
            M(aI * (Z - v), s);
          },
          scrollBy: function(aI, s, aJ) {
            Q.scrollByX(aI, aJ);
            Q.scrollByY(s, aJ);
          },
          scrollByX: function(s, aJ) {
            var aI, aK;
            aI = aC() + Math[(s < 0 ? "floor" : "ceil")](s);
            aK = aI / (T - aj);
            W(aK * j, aJ);
          },
          scrollByY: function(s, aJ) {
            var aI, aK;
            aI = aA() + Math[(s < 0 ? "floor" : "ceil")](s);
            aK = aI / (Z - v);
            V(aK * i, aJ);
          },
          positionDragX: function(s, aI) {
            W(s, aI);
          },
          positionDragY: function(aI, s) {
            V(aI, s);
          },
          animate: function(aI, aL, s, aK) {
            var aJ;
            aJ = {};
            aJ[aL] = s;
            aI.animate(aJ, {
              duration: ay.animateDuration,
              easing: ay.animateEase,
              queue: false,
              step: aK
            });
          },
          getContentPositionX: function() {
            return aC();
          },
          getContentPositionY: function() {
            return aA();
          },
          getContentWidth: function() {
            return T;
          },
          getContentHeight: function() {
            return Z;
          },
          getPercentScrolledX: function() {
            return aC() / (T - aj);
          },
          getPercentScrolledY: function() {
            return aA() / (Z - v);
          },
          getIsScrollableH: function() {
            return aE;
          },
          getIsScrollableV: function() {
            return az;
          },
          getContentPane: function() {
            return Y;
          },
          scrollToBottom: function(s) {
            V(i, s);
          },
          hijackInternalLinks: b.noop,
          destroy: function() {
            g();
          }
        });
        ar(O);
      };
      e = b.extend({}, b.fn.jScrollPane.defaults, e);
      b.each(["mouseWheelSpeed", "arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
        e[this] = e[this] || e.speed;
      });
      return this.each(function() {
        var f, g;
        f = b(this);
        g = f.data("jsp");
        if (g) {
          g.reinitialise(e);
        } else {
          b("script", f).filter("[type=\"text/javascript\"],:not([type])").remove();
          g = new d(f, e);
          f.data("jsp", g);
        }
      });
    };
    b.fn.jScrollPane.defaults = {
      showArrows: false,
      maintainPosition: true,
      stickToBottom: false,
      stickToRight: false,
      clickOnTrack: true,
      autoReinitialise: false,
      autoReinitialiseDelay: 500,
      verticalDragMinHeight: 0,
      verticalDragMaxHeight: 99999,
      horizontalDragMinWidth: 0,
      horizontalDragMaxWidth: 99999,
      contentWidth: c,
      animateScroll: false,
      animateDuration: 300,
      animateEase: "linear",
      hijackInternalLinks: false,
      verticalGutter: 4,
      horizontalGutter: 4,
      mouseWheelSpeed: 0,
      arrowButtonSpeed: 0,
      arrowRepeatFreq: 50,
      arrowScrollOnHover: false,
      trackClickSpeed: 0,
      trackClickRepeatFreq: 70,
      verticalArrowPositions: "split",
      horizontalArrowPositions: "split",
      enableKeyboardNavigation: true,
      hideFocus: false,
      keyboardSpeed: 0,
      initialDelay: 300,
      speed: 30,
      scrollPagePercent: 0.8
    };
  })(jQuery, this);

}).call(this);

/*
Collapsible, jQuery Plugin

This plugin enables the management of
collapsibles on the page with cookie support.

Copyright (c) 2010 John Snyder (snyderplace.com)
@license http://www.snyderplace.com/collapsible/license.txt New BSD
@version 1.1
*/


(function() {
  (function($) {
    var appendCookie, close, collapsed, createCollapsible, getDefaultOpen, inCookie, inDefaultOpen, issetCookie, loadOpts, open, saveOpts, setCookie, toggle, unsetCookieId, useCookies;
    createCollapsible = function(obj, options) {
      var opened, opts;
      opts = $.extend({}, $.fn.collapsible.defaults, options);
      opened = new Array();
      obj.each(function() {
        var $this, cookieIndex, dOpenIndex, id;
        $this = $(this);
        saveOpts($this, opts);
        if (opts.bind === "mouseenter") {
          $this.bind("mouseenter", function(e) {
            e.preventDefault();
            toggle($this, opts);
          });
        }
        if (opts.bind === "mouseover") {
          $this.bind("mouseover", function(e) {
            e.preventDefault();
            toggle($this, opts);
          });
        }
        if (opts.bind === "click") {
          $this.bind("click", function(e) {
            e.preventDefault();
            toggle($this, opts);
          });
        }
        if (opts.bind === "dblclick") {
          $this.bind("dblclick", function(e) {
            e.preventDefault();
            toggle($this, opts);
          });
        }
        id = $this.attr("id");
        if (!useCookies(opts)) {
          dOpenIndex = inDefaultOpen(id, opts);
          if (dOpenIndex === false) {
            $this.addClass(opts.cssClose);
            $this.next().hide();
          } else {
            $this.addClass(opts.cssOpen);
            $this.next().show();
            opened.push(id);
          }
        } else {
          if (issetCookie(opts)) {
            cookieIndex = inCookie(id, opts);
            if (cookieIndex === false) {
              $this.addClass(opts.cssClose);
              $this.next().hide();
            } else {
              $this.addClass(opts.cssOpen);
              $this.next().show();
              opened.push(id);
            }
          } else {
            dOpenIndex = inDefaultOpen(id, opts);
            if (dOpenIndex === false) {
              $this.addClass(opts.cssClose);
              $this.next().hide();
            } else {
              $this.addClass(opts.cssOpen);
              $this.next().show();
              opened.push(id);
            }
          }
        }
      });
      if (opened.length > 0 && useCookies(opts)) {
        setCookie(opened.toString(), opts);
      } else {
        setCookie("", opts);
      }
      return obj;
    };
    loadOpts = function($this) {
      return $this.data("collapsible-opts");
    };
    saveOpts = function($this, opts) {
      return $this.data("collapsible-opts", opts);
    };
    collapsed = function($this, opts) {
      return $this.hasClass(opts.cssClose);
    };
    close = function($this, opts) {
      var id;
      $this.addClass(opts.cssClose).removeClass(opts.cssOpen);
      opts.animateOpen($this, opts);
      if (useCookies(opts)) {
        id = $this.attr("id");
        unsetCookieId(id, opts);
      }
    };
    open = function($this, opts) {
      var id;
      $this.removeClass(opts.cssClose).addClass(opts.cssOpen);
      opts.animateClose($this, opts);
      if (useCookies(opts)) {
        id = $this.attr("id");
        appendCookie(id, opts);
      }
    };
    toggle = function($this, opts) {
      if (collapsed($this, opts)) {
        open($this, opts);
      } else {
        close($this, opts);
      }
      return false;
    };
    useCookies = function(opts) {
      if (!$.cookie || opts.cookieName === "") {
        return false;
      }
      return true;
    };
    appendCookie = function(value, opts) {
      var cookie, cookieArray;
      if (!useCookies(opts)) {
        return false;
      }
      if (!issetCookie(opts)) {
        setCookie(value, opts);
        return true;
      }
      if (inCookie(value, opts)) {
        return true;
      }
      cookie = $.cookie(opts.cookieName);
      cookie = unescape(cookie);
      cookieArray = cookie.split(",");
      cookieArray.push(value);
      setCookie(cookieArray.toString(), opts);
      return true;
    };
    unsetCookieId = function(value, opts) {
      var cookie, cookieArray, cookieIndex;
      if (!useCookies(opts)) {
        return false;
      }
      if (!issetCookie(opts)) {
        return true;
      }
      cookieIndex = inCookie(value, opts);
      if (cookieIndex === false) {
        return true;
      }
      cookie = $.cookie(opts.cookieName);
      cookie = unescape(cookie);
      cookieArray = cookie.split(",");
      cookieArray.splice(cookieIndex, 1);
      setCookie(cookieArray.toString(), opts);
    };
    setCookie = function(value, opts) {
      if (!useCookies(opts)) {
        return false;
      }
      $.cookie(opts.cookieName, value, opts.cookieOptions);
    };
    inCookie = function(value, opts) {
      var cookie, cookieArray, cookieIndex;
      if (!useCookies(opts)) {
        return false;
      }
      if (!issetCookie(opts)) {
        return false;
      }
      cookie = unescape($.cookie(opts.cookieName));
      cookieArray = cookie.split(",");
      cookieIndex = $.inArray(value, cookieArray);
      if (cookieIndex === -1) {
        return false;
      }
      return cookieIndex;
    };
    issetCookie = function(opts) {
      if (!useCookies(opts)) {
        return false;
      }
      if ($.cookie(opts.cookieName) == null) {
        return false;
      }
      return true;
    };
    inDefaultOpen = function(id, opts) {
      var defaultOpen, index;
      defaultOpen = getDefaultOpen(opts);
      index = $.inArray(id, defaultOpen);
      if (index === -1) {
        return false;
      }
      return index;
    };
    getDefaultOpen = function(opts) {
      var defaultOpen;
      defaultOpen = new Array();
      if (opts.defaultOpen !== "") {
        defaultOpen = opts.defaultOpen.split(",");
      }
      return defaultOpen;
    };
    $.fn.collapsible = function(cmd, arg) {
      if (typeof cmd === "string") {
        return $.fn.collapsible.dispatcher[cmd](this, arg);
      }
      return $.fn.collapsible.dispatcher["_create"](this, cmd);
    };
    $.fn.collapsible.dispatcher = {
      _create: function(obj, arg) {
        createCollapsible(obj, arg);
      },
      toggle: function(obj) {
        toggle(obj, loadOpts(obj));
        return obj;
      },
      open: function(obj) {
        open(obj, loadOpts(obj));
        return obj;
      },
      close: function(obj) {
        close(obj, loadOpts(obj));
        return obj;
      },
      collapsed: function(obj) {
        return collapsed(obj, loadOpts(obj));
      }
    };
    $.fn.collapsible.defaults = {
      cssClose: "collapse-close",
      cssOpen: "collapse-open",
      cookieName: "collapsible",
      cookieOptions: {
        path: "/",
        expires: 7,
        domain: "",
        secure: ""
      },
      defaultOpen: "",
      speed: "slow",
      bind: "click",
      animateOpen: function(elem, opts) {
        elem.next().slideUp(opts.speed);
      },
      animateClose: function(elem, opts) {
        elem.next().slideDown(opts.speed);
      }
    };
  })(jQuery);

}).call(this);

(function() {
  (function(window, undefined_) {
    $(document).ready(function() {
      var mouseCopy;
      mouseCopy = $.extend({}, $.ui.mouse.prototype);
      $.extend($.ui.mouse.prototype, {
        _mouseInit: function() {
          var that;
          that = this;
          if (!this.options.mouseButton) {
            this.options.mouseButton = 1;
          }
          mouseCopy._mouseInit.apply(this, arguments_);
          if (this.options.mouseButton === 3) {
            this.element.bind("contextmenu." + this.widgetName, function(event) {
              if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, that.widgetName + ".preventClickEvent");
                event.stopImmediatePropagation();
                return false;
              }
              event.preventDefault();
              return false;
            });
          }
          this.started = false;
        },
        _mouseDown: function(event) {
          var btnIsLeft, elIsCancel, mouseHandled, that;
          this._mouseStarted && this._mouseUp(event);
          this._mouseDownEvent = event;
          that = this;
          btnIsLeft = event.which === this.options.mouseButton;
          elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
          if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
            return true;
          }
          this.mouseDelayMet = !this.options.delay;
          if (!this.mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(function() {
              that.mouseDelayMet = true;
            }, this.options.delay);
          }
          if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted = this._mouseStart(event) !== false;
            if (!this._mouseStarted) {
              event.preventDefault();
              return true;
            }
          }
          if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
            $.removeData(event.target, this.widgetName + ".preventClickEvent");
          }
          this._mouseMoveDelegate = function(event) {
            return that._mouseMove(event);
          };
          this._mouseUpDelegate = function(event) {
            return that._mouseUp(event);
          };
          $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
          event.preventDefault();
          mouseHandled = true;
          return true;
        }
      });
    });
  })(window);

}).call(this);

(function() {
  (function(a) {
    var b, c, d;
    d = function(b) {
      var c, e, f, g, h;
      c = b || window.event;
      d = [].slice.call(arguments_, 1);
      e = 0;
      f = !0;
      g = 0;
      h = 0;
      b = a.event.fix(c);
      b.type = "mousewheel";
      c.wheelDelta && (e = c.wheelDelta / 120);
      c.detail && (e = -c.detail / 3);
      h = e;
      c.axis !== undefined && c.axis === c.HORIZONTAL_AXIS && (h = 0, g = -1 * e);
      c.wheelDeltaY !== undefined && (h = c.wheelDeltaY / 120);
      c.wheelDeltaX !== undefined && (g = -1 * c.wheelDeltaX / 120);
      d.unshift(b, e, g, h);
      return (a.event.dispatch || a.event.handle).apply(this, d);
    };
    b = ["DOMMouseScroll", "mousewheel"];
    if (a.event.fixHooks) {
      c = b.length;
      while (c) {
        a.event.fixHooks[b[--c]] = a.event.mouseHooks;
      }
    }
    a.event.special.mousewheel = {
      setup: function() {
        if (this.addEventListener) {
          a = b.length;
          while (a) {
            this.addEventListener(b[--a], d, !1);
          }
        } else {
          this.onmousewheel = d;
        }
      },
      teardown: function() {
        if (this.removeEventListener) {
          a = b.length;
          while (a) {
            this.removeEventListener(b[--a], d, !1);
          }
        } else {
          this.onmousewheel = null;
        }
      }
    };
    a.fn.extend({
      mousewheel: function(a) {
        if (a) {
          return this.bind("mousewheel", a);
        } else {
          return this.trigger("mousewheel");
        }
      },
      unmousewheel: function(a) {
        return this.unbind("mousewheel", a);
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(a) {
    var b, c, d;
    d = function(b) {
      var c, e, f, g, h;
      c = b || window.event;
      d = [].slice.call(arguments_, 1);
      e = 0;
      f = !0;
      g = 0;
      h = 0;
      b = a.event.fix(c);
      b.type = "mousewheel";
      c.wheelDelta && (e = c.wheelDelta / 120);
      c.detail && (e = -c.detail / 3);
      h = e;
      c.axis !== undefined && c.axis === c.HORIZONTAL_AXIS && (h = 0, g = -1 * e);
      c.wheelDeltaY !== undefined && (h = c.wheelDeltaY / 120);
      c.wheelDeltaX !== undefined && (g = -1 * c.wheelDeltaX / 120);
      d.unshift(b, e, g, h);
      return (a.event.dispatch || a.event.handle).apply(this, d);
    };
    b = ["DOMMouseScroll", "mousewheel"];
    if (a.event.fixHooks) {
      c = b.length;
      while (c) {
        a.event.fixHooks[b[--c]] = a.event.mouseHooks;
      }
    }
    a.event.special.mousewheel = {
      setup: function() {
        if (this.addEventListener) {
          a = b.length;
          while (a) {
            this.addEventListener(b[--a], d, !1);
          }
        } else {
          this.onmousewheel = d;
        }
      },
      teardown: function() {
        if (this.removeEventListener) {
          a = b.length;
          while (a) {
            this.removeEventListener(b[--a], d, !1);
          }
        } else {
          this.onmousewheel = null;
        }
      }
    };
    a.fn.extend({
      mousewheel: function(a) {
        if (a) {
          return this.bind("mousewheel", a);
        } else {
          return this.trigger("mousewheel");
        }
      },
      unmousewheel: function(a) {
        return this.unbind("mousewheel", a);
      }
    });
  })(jQuery);

}).call(this);
