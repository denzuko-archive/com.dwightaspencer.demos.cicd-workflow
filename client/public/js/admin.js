/*global angular*/
/*global $*/
/*global _*/
(function () {
    "use strict";

    var app = angular.module('admin', ['ng-admin']);

    app.controller('main', function ($scope, $rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.displayBanner = $location.$$path === '/dashboard';
        });
    });

    app.config(['NgAdminConfigurationProvider', 'RestangularProvider', function (nga, rga) {

        function truncate(value) {
            if (!value) return '';

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // create an admin application and point it to the main API endpoint
        var admin = nga.application('Demo Dashboard')
            .baseApiUrl('https://ioinet-api.denzuko.c9users.io/v1/');

        // Add the API endpoints used for this entity
        // 'https://ioinet-api.denzuko.c9users.io/v1/users/:id'
        // 'https://ioinet-api.denzuko.c9users.io/v1/roles/:id'
        // 'https://ioinet-api.denzuko.c9users.io/v1/devices/:id'
        // 'https://ioinet-api.denzuko.c9users.io/v1/sensors/:id'
        // 'https://ioinet-api.denzuko.c9users.io/v1/events/:id'
        // 'https://ioinet-api.denzuko.c9users.io/v1/tags/:id'

        var user    = nga.entity('users').identifier(nga.field('userId')),
            roles   = nga.entity('roles').identifier(nga.field('roleId')),
            devices = nga.entity('devices').identifier(nga.field('deviceId')),
            sensors = nga.entity('sensors').identifier(nga.field('sensorId')),
            events  = nga.entity('events').identifier(nga.field('_id')),
            tags    = nga.entity('tags').identifier(nga.field('tagId'));

        // set the fields of the user entity list view
        user.listView().fields([
            nga.field('name'),
            nga.field('username'),
            nga.field('email')
        ]);

        roles.listView().fields([
            nga.field('name'),
            nga.field('id')
        ]);

        sensors.listView().fields([
            nga.field('name'),
            nga.field('id'),
            nga.field('customerId', 'reference')
               .label('Owner')
               .targetEntity(user)
               .targetField('name'),
            nga.field('deviceId', 'reference')
               .label('Device')
               .targetEntity(devices)
               .targetField(nga.field('name')),
            nga.field('state'),
            nga.field('lastSeen', 'date')
        ]);

        events.listView().fields([
            nga.field('name'),
            nga.field('id')
        ]);

        devices.updateMethod('post'); // default is 'put'
        devices.createMethod('put');   // default is 'post'

        devices.listView()
            .title('My Smart Devices') // default title is "[Entity_name] list"
            .description('List of devices with infinite pagination') // description appears under the title
            .infinitePagination(true) // load pages as the user scrolls
            .fields([
                nga.field('customerId', 'reference')
                   .label('Owner')
                   .targetEntity(user).targetField(nga.field('name')),
                nga.field('id').label('MAC Address'),
                nga.field('name', 'string'),
                nga.field('lastSeen', 'date'),
                nga.field('tags', 'reference_many')
                    .targetEntity(tags).targetField(nga.field('name')),
                nga.field('sensorId', 'reference')
                   .label('Sensors')
                   .targetEntity(sensors)
                   .targetField(nga.field('name')),
                nga.field('state'),
                nga.field('lastSeen', 'date')
            ])
            .listActions(['show', 'edit', 'delete']);

        devices.creationView()
            .fields([
                nga.field('id') // the default edit field type is "string", and displays as a text input
                    .attributes({ placeholder: 'de-ad-be-ef' }) // you can add custom attributes, too
                    .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
                nga.field('name', 'text'), // text field type translates to a textarea
                nga.field('lastSeen', 'date') // Date field type translates to a datepicker
            ]);

        devices.editionView()
            .fields([
                nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
                    .targetEntity(tags)
                    .targetField(nga.field('name'))
                    .permanentFilters(function(search) {
                        return search ? { q: search } : null;
                    })
                    .remoteComplete(true, { refreshDelay: 300 })
                    .cssClasses('col-sm-4'), // customize look and feel through CSS classes
			    nga.field('id').label('#'),
			    nga.field('health').label('#'),
                nga.field('device', 'template').label('')
                    .template('<span class="pull-right"><ma-filtered-list-button entity-name="comments" filter="{ deviceId: entry.data.id }" size="sm"></ma-filtered-list-button></span>')
            ]);

        devices.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .fields([
                nga.field('id'),
                devices.editionView().fields(), // reuse fields from another view in another order
                nga.field('custom_action', 'template')
                    .label('')
                    .template('<send-email post="entry"></send-email>')
            ]);

        admin.addEntity(user)
             .addEntity(roles)
             .addEntity(events)
             .addEntity(sensors)
             .addEntity(devices)
             .addEntity(tags);

        // customize header
        admin.header(
           $("<div>", {class: "navbar-header"})
             .append($("<a>",{
                 class: "navbar-brand",
                 href: "#",
                 "ng-click": "appController.displayHome()"})
                 .text("Demo Dashboard")
             )
        );

        // Sidebar menu
        admin.menu(nga.menu()
            .addChild(nga.menu(devices).icon("<span class='glyphicon glyphicon-file'></span>"))
            .addChild(nga.menu(sensors).icon("<span class='glyphicon glyphicon-tags'></span>"))
            .addChild(nga.menu(events).icon("<span class='glyphicon glyphicon-calendar'></span>"))
            .addChild(nga.menu(user).icon("<span class='glyphicon glyphicon-user'></span>"))
        );

        // Central dashboard
        var customDashboardTemplate =
        '<div class="row dashboard-starter"></div>' +
        '<div class="row dashboard-content"><div class="col-lg-12"><div class="alert alert-info">' +
            'Welcome to the demo! Fell free to explore and modify the data. We reset it every few minutes.' +
        '</div></div></div>' +
        '<div class="row dashboard-content">' +
            '<div class="col-lg-12">' +
                '<div class="panel panel-default">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.comments" entries="dashboardController.entries.comments"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="row dashboard-content">' +
            '<div class="col-lg-6">' +
                '<div class="panel panel-green">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.recent_posts" entries="dashboardController.entries.recent_posts"></ma-dashboard-panel>' +
                '</div>' +
                '<div class="panel panel-green">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.popular_posts" entries="dashboardController.entries.popular_posts"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<div class="panel panel-yellow">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.tags" entries="dashboardController.entries.tags"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
        '</div>';
        admin.dashboard(nga.dashboard()
            .addCollection(nga.collection(devices)
                .name('recent_devices')
                .title('Recent devices')
                .perPage(5) // limit the panel to the 5 latest posts
                .fields([
                    nga.field('lastSeen', 'date').label('Last Seen').format('MMM d'),
                    nga.field('title').isDetailLink(true).map(truncate),
                    nga.field('views', 'number')
                ])
                .sortField('state')
                .sortDir('DESC')
                .order(1)
            )
            .addCollection(nga.collection(tags)
                .title('Tags publication status')
                .perPage(10)
                .fields([
                    nga.field('name')
                ])
                .listActions(['show'])
                .order(4)
            )
            .template(customDashboardTemplate)
        );

        rga.addElementTransformer('devices', function(element) {
            for (var key in element.data) {
                element[key] = element.data[key];
            }

            return element;
        });

        // use the custom query parameters function to format the API request correctly
        rga.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (operation == "getList") {
                // custom pagination params
                if (params._page) {
                    params.offset = (params._page - 1) * params._perPage;
                    params.limit  = params._page * params._perPage;
                    delete params._page;
                    delete params._perPage;
                }
                // custom sort params
                if (params._sortField) {
                    params.sort  = params.sort.field || 'id';
                    params.order = params.sort.order || 'DESC';
                    delete params._sortField;
                    delete params._sortDir;
                }
                // custom filters
                if (params._filters) {
                    for (var filter in params._filters) {
                        params.filter[filter] = params._filters[filter];
                    }
                    delete params._filters;
                }
            }

            return { params: params };
        });

        nga.configure(admin);
    }]);

}());