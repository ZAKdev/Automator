require! \./prelude
require! \./mobi-spy

window.startRecordingTap ->
    {creative: 'etisalat', suffix: 'etisalat', campaign-id: window.mobiOneConstants.campaign-id}

window.spy.recordEvent {creative: 'etisalat', suffix: 'etisalat', eventType: 'populating', campaign-id: window.mobiOneConstants.campaign-id}

window.add-event-listener \load, ->
    window.spy.recordEvent {creative: 'etisalat', suffix: 'etisalat', eventType: 'pageReady', campaign-id: window.mobiOneConstants.campaign-id}