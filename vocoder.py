import numpy as np
import scipy.signal as sig
import matplotlib.pyplot as plt
import scipy.io.wavfile as wav
import random
import heapq
import ntpath

tol = 0.0001

### Routines

def principal_argument(x):
    return(x - 2*np.pi*round(x/(2*np.pi)))

def BackwardDifferenceT(Aa, m, n, phaseTableau, M):
    return(principal_argument(phaseTableau[m,n] - phaseTableau[m,n-1] -2*np.pi*m*Aa/M)/Aa + 2*np.pi*m/M)

def ForwardDifferenceT(Aa, m, n, phaseTableau, M):
    return(principal_argument(phaseTableau[m,n+1] - phaseTableau[m,n] -2*np.pi*m*Aa/M)/Aa + 2*np.pi*m/M)

def CenteredDifferenceT(Aa, m, n, phaseTableau, M):
    return((BackwardDifferenceT(Aa, m, n, phaseTableau, M) + ForwardDifferenceT(Aa, m, n, phaseTableau, M))/2)

def BackwardDifferenceF(Ba, m, n, phaseTableau):
    return(principal_argument(principal_argument(phaseTableau[m,n] - phaseTableau[m-1,n])/Ba))

def ForwardDifferenceF(Ba, m, n, phaseTableau):
    return(principal_argument(principal_argument(phaseTableau[m+1,n] - phaseTableau[m,n])/Ba))

def CenteredDifferenceF(Ba, m, n, phaseTableau):
    return((BackwardDifferenceF(Ba, m, n, phaseTableau) + ForwardDifferenceF(Ba, m, n, phaseTableau))/2)


### Vocodeurs

def vocodeur_simple(fs, data, ratio):
    nperseg_i = 1024  # doit être un multiple de 4...
    noverlap_i = int(0.75 * nperseg_i)  # car ici il est multiplié par 3/4
    ratio = ((int(ratio * nperseg_i) // 4) * 4.) / float(nperseg_i)  # permet d'avoir neperseg_f aussi multiple de 4
    nperseg_f = int(ratio * nperseg_i)
    noverlap_f = int(0.75 * nperseg_f)
    _, _, X = sig.stft(data, fs=fs, nperseg=nperseg_i, noverlap=noverlap_i, nfft=(nperseg_f if ratio >= 1.0 else None))

    Ra = float(nperseg_i) / float(fs)
    Rs = ratio * Ra

    nFreqs, nTimes = X.shape
    Y = np.zeros((nFreqs, nTimes), dtype=X.dtype)

    Y[:, 0] = X[:, 0]
    for k in range(nFreqs):
        nu_k = 2. * float(k) * np.pi / float(nFreqs)
        phase_X = np.angle(Y[k, 0])
        phase_Y = np.angle(Y[k, 0])
        for u in range(1, nTimes):
            new_phase_X = np.angle(X[k, u])
            delta_phi = new_phase_X - phase_X - Ra * nu_k
            phase_X = new_phase_X
            phase_Y += Rs * nu_k + ratio * principal_argument(delta_phi)
            Y[k, u] = np.abs(X[k, u]) * np.exp(1j * phase_Y)

    _, result = sig.istft(Y, fs=fs, nperseg=nperseg_f, noverlap=noverlap_f, nfft=(nperseg_i if ratio < 1.0 else None))
    return result.astype(np.int16)


def vocodeur_avance(fs, data, ratio):
    L = len(data)
    nperseg_i = 1024  # doit être un multiple de 4...
    noverlap_i = int(0.75 * nperseg_i)  # car ici il est multiplié par 3/4
    ratio = ((int(ratio * nperseg_i) // 4) * 4.) / float(nperseg_i)  # permet d'avoir neperseg_f aussi multiple de 4
    nperseg_f = int(ratio * nperseg_i)
    noverlap_f = int(0.75 * nperseg_f)
    _, _, X = sig.stft(data, fs=fs, nperseg=nperseg_i, noverlap=noverlap_i,
                       nfft=(nperseg_f if ratio >= 1.0 else None))


    M, N = X.shape
    Aa = L / N
    Ba = L / M
    As = ratio * Aa
    Bs = ratio * Ba
    Y = np.zeros((M, N), dtype=X.dtype)
    phaseTableau = np.array([[np.angle(X[m, n]) for n in range(N)] for m in range(M)])
    phaseEstimeTableau = np.zeros((M, N))
    phaseEstimeTableau[:, 0] = phaseTableau[:, 0]
    S = np.array([[np.abs(X[m, n]) for n in range(N)] for m in range(M)])
    diffTtable = np.concatenate((np.concatenate((np.zeros((M, 1)), [
        [CenteredDifferenceT(Aa, m, n, phaseTableau, M) for n in range(1, N - 1)] for m in range(M)]), axis=1),
                                 np.zeros((M, 1))), axis=1)
    diffFtable = np.concatenate((np.concatenate((np.zeros((1, N)),
                                                 [[CenteredDifferenceF(Ba, m, n, phaseTableau) for n in range(N)]
                                                  for m in range(1, M - 1)]), axis=0), np.zeros((1, N))), axis=0)
    # Y[:, 0] = X[:, 0]
    abstol = 0.0
    for n in range(1, N):
        abstol = tol * np.max([np.max(S[:, n]), np.max(S[:, n - 1])])
        I = []
        for m in range(M):
            if S[m, n] > abstol:
                I.append(m)
            else:
                phaseEstimeTableau[m, n] = 2 * random.random() * np.pi
        heap = []
        for m in I:
            heapq.heappush(heap, (-S[m, n-1],(m, n - 1)))
        while I != []:
            (rien, (mh, nh)) = heapq.heappop(heap)
            if nh == n - 1:
                if mh in I:
                    phaseEstimeTableau[mh, n] = phaseEstimeTableau[mh, n - 1] + (As / 2) * (
                                diffTtable[mh, n - 1] + diffTtable[mh, n])
                    I.remove(mh)
                    heapq.heappush(heap, (-S[mh, n], (mh, n)))
            if nh == n:
                if (mh + 1) in I:
                    phaseEstimeTableau[mh + 1, n] = phaseEstimeTableau[mh, n] + (Bs / 2) * (
                                diffFtable[mh, n] + diffFtable[mh + 1, n])
                    I.remove(mh + 1)
                    heapq.heappush(heap, (-S[mh +1, n], (mh + 1, n)))
                if (mh - 1) in I:
                    phaseEstimeTableau[mh - 1, n] = phaseEstimeTableau[mh, n] + (Bs / 2) * (
                                diffFtable[mh, n] + diffFtable[mh - 1, n])
                    I.remove(mh - 1)
                    heapq.heappush(heap, (-S[mh -1, n],(mh - 1, n)))

    for n in range(N):
        for m in range(M):
            Y[m, n] = np.abs(S[m, n]) * np.exp(1j * phaseEstimeTableau[m, n])

    _, result = sig.istft(Y, fs=fs, nperseg=nperseg_f, noverlap=noverlap_f, nfft=(nperseg_i if ratio < 1.0 else None))
    return result.astype(np.int16)


### Entrées / Sorties

# Stéréo vers mono

def stereo_vers_mono(data):
    n = len(data)
    l1 = np.zeros(n, dtype=data.dtype)
    for i in range(n - 1):
        l1[i] = data[i][0]
    return l1


def entree(filename):
    fs, data = wav.read(filename)
    if np.array(data).ndim == 2:
        data = stereo_vers_mono(data)
    return fs, data


def sortie(fs, data, filename):
    wav.write('static/' + filename, fs, data)


### Méthodes

def convert_invert(filename):
    fs, data = entree(filename)
    sortie(fs, np.array(data[::-1]), ntpath.basename(filename))


def convert_ts_sam(filename, ratio):
    fs, data = entree(filename)
    sortie(int(fs/ratio), data, ntpath.basename(filename))


def convert_ps_sam(filename, ratio):
    convert_ts_sam(filename, 1.0 / float(ratio))

    
def convert_ts_sv(filename, ratio):
    fs, data = entree(filename)
    result = vocodeur_simple(fs, data, ratio)
    sortie(fs, result, ntpath.basename(filename))


def convert_ps_sv(filename, ratio):
    fs, data = entree(filename)
    result = vocodeur_simple(fs, data, ratio)
    sortie(int(ratio * fs), result, ntpath.basename(filename))


def convert_ts_av(filename, ratio):
    fs, data = entree(filename)
    result = vocodeur_avance(fs, data, ratio)
    sortie(fs, result, ntpath.basename(filename))


def convert_ps_av(filename, ratio):
    fs, data = entree(filename)
    result = vocodeur_avance(fs, data, ratio)
    sortie(int(ratio * fs), result, ntpath.basename(filename))
