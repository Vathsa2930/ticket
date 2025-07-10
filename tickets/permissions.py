from rest_framework import permissions

class IsOwnerOrSupport(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or support staff to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the ticket or support staff.
        return obj.created_by == request.user or request.user.is_support
