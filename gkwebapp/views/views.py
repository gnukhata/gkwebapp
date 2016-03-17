from pyramid.i18n import TranslationStringFactory

_ = TranslationStringFactory('gkwebapp')


def my_view(request):
    return {'project': 'gkwebapp'}
