'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// Cribbed from https://github.com/hokein/electron-sample-apps/blob/master/tray/main.js

var defaultMenu = [
// {
//   label: 'Item1',
//   type: 'radio',
//   icon: iconPath
// },
// {
//   label: 'Item2',
//   submenu: [
//     { label: 'submenu1' },
//     { label: 'submenu2' }
//   ]
// },
// {
//   label: 'Item3',
//   type: 'radio',
//   checked: true
// },
// {
//   label: 'Toggle DevTools',
//   accelerator: 'CommandOrControl+Shift+I',
//   click: function() {
//     win.show();
//     win.toggleDevTools();
//   }
// },
{ label: 'Quit',
  accelerator: 'CommandOrControl+Q',
  selector: 'terminate:'
}];

var TrayControl = function TrayControl(app, iconPath) {
  var _this = this;

  var menu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMenu;

  _classCallCheck(this, TrayControl);

  this.app = app;
  app.on('ready', function () {
    _this.appIcon = new _electron.Tray(iconPath);
    _this.contextMenu = _electron.Menu.buildFromTemplate(menu);
    _this.appIcon.setToolTip('This is my application.');
    _this.appIcon.setContextMenu(_this.contextMenu);
  });
};

exports.default = TrayControl;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTs7QUFDQTs7Ozs7OztBQUhBOztBQUtBLElBQU0sY0FBYztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxNQUFUO0FBQ0UsZUFBYSxvQkFEZjtBQUVFLFlBQVU7QUFGWixDQTFCa0IsQ0FBcEI7O0lBZ0NNLFcsR0FDSixxQkFBWSxHQUFaLEVBQWlCLFFBQWpCLEVBQStDO0FBQUE7O0FBQUEsTUFBcEIsSUFBb0IsdUVBQWIsV0FBYTs7QUFBQTs7QUFDN0MsT0FBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLE1BQUksRUFBSixDQUFPLE9BQVAsRUFBZ0IsWUFBTTtBQUNwQixVQUFLLE9BQUwsR0FBZSxtQkFBUyxRQUFULENBQWY7QUFDQSxVQUFLLFdBQUwsR0FBbUIsZUFBSyxpQkFBTCxDQUF1QixJQUF2QixDQUFuQjtBQUNBLFVBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IseUJBQXhCO0FBQ0EsVUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixNQUFLLFdBQWpDO0FBQ0QsR0FMRDtBQU1ELEM7O2tCQUdZLFciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIENyaWJiZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vaG9rZWluL2VsZWN0cm9uLXNhbXBsZS1hcHBzL2Jsb2IvbWFzdGVyL3RyYXkvbWFpbi5qc1xuXG5pbXBvcnQge1RyYXksIE1lbnUsIEJyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBkZWZhdWx0TWVudSA9IFtcbiAgLy8ge1xuICAvLyAgIGxhYmVsOiAnSXRlbTEnLFxuICAvLyAgIHR5cGU6ICdyYWRpbycsXG4gIC8vICAgaWNvbjogaWNvblBhdGhcbiAgLy8gfSxcbiAgLy8ge1xuICAvLyAgIGxhYmVsOiAnSXRlbTInLFxuICAvLyAgIHN1Ym1lbnU6IFtcbiAgLy8gICAgIHsgbGFiZWw6ICdzdWJtZW51MScgfSxcbiAgLy8gICAgIHsgbGFiZWw6ICdzdWJtZW51MicgfVxuICAvLyAgIF1cbiAgLy8gfSxcbiAgLy8ge1xuICAvLyAgIGxhYmVsOiAnSXRlbTMnLFxuICAvLyAgIHR5cGU6ICdyYWRpbycsXG4gIC8vICAgY2hlY2tlZDogdHJ1ZVxuICAvLyB9LFxuICAvLyB7XG4gIC8vICAgbGFiZWw6ICdUb2dnbGUgRGV2VG9vbHMnLFxuICAvLyAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZE9yQ29udHJvbCtTaGlmdCtJJyxcbiAgLy8gICBjbGljazogZnVuY3Rpb24oKSB7XG4gIC8vICAgICB3aW4uc2hvdygpO1xuICAvLyAgICAgd2luLnRvZ2dsZURldlRvb2xzKCk7XG4gIC8vICAgfVxuICAvLyB9LFxuICB7IGxhYmVsOiAnUXVpdCcsXG4gICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kT3JDb250cm9sK1EnLFxuICAgIHNlbGVjdG9yOiAndGVybWluYXRlOicsXG4gIH1cbl07XG5cbmNsYXNzIFRyYXlDb250cm9sIHtcbiAgY29uc3RydWN0b3IoYXBwLCBpY29uUGF0aCwgbWVudSA9IGRlZmF1bHRNZW51KSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgYXBwLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIHRoaXMuYXBwSWNvbiA9IG5ldyBUcmF5KGljb25QYXRoKTtcbiAgICAgIHRoaXMuY29udGV4dE1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKG1lbnUpO1xuICAgICAgdGhpcy5hcHBJY29uLnNldFRvb2xUaXAoJ1RoaXMgaXMgbXkgYXBwbGljYXRpb24uJyk7XG4gICAgICB0aGlzLmFwcEljb24uc2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudSk7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYXlDb250cm9sO1xuIl19